import { AssistantResponse, MessageControls } from "../../dom/MessageElements";
import EventBus from "../../events/EventBus";
import { AddedText, ElementTextStream, InputStreamOptions } from "../../tts/InputStream";
import { TTSControlsModule } from "../../tts/TTSControlsModule";
import { logger } from "../../LoggingModule";

/**
 * Claude-specific utilities and classes for extracting readable text and
 * streaming assistant responses. Isolated here to keep fragile DOM parsing
 * logic cohesive and easy to test in isolation.
 */

// Reusable text extractor so all Claude entry points share filters
export function extractClaudeReadableText(node: Node): string {
  const BLOCKED_CLASSES = new Set(["transition-all", "transition-colors", "code-block__code"]);
  const BLOCKED_CLASS_COMBINATIONS = [["ease-out", "border-border-300"]];
  const SKIPPED_ELEMENTS = new Set(["pre"]);

  if (node.nodeType === Node.ELEMENT_NODE) {
    const el = node as HTMLElement;
    if (SKIPPED_ELEMENTS.has(el.tagName.toLowerCase())) {
      return "";
    }
    const hasBlockedCombination = BLOCKED_CLASS_COMBINATIONS.some((combination) =>
      combination.every((cls) => el.classList.contains(cls))
    );
    if (hasBlockedCombination) {
      return "";
    }
    for (const cls of el.classList) {
      if (BLOCKED_CLASSES.has(cls)) {
        return "";
      }
    }
  }

  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent ?? "";
  }

  let text = "";
  node.childNodes.forEach((child) => {
    text += extractClaudeReadableText(child);
  });
  return text;
}

export class ClaudeResponse extends AssistantResponse {
  constructor(element: HTMLElement, includeInitialText?: boolean) {
    super(element, includeInitialText);
  }

  get contentSelector(): string {
    return "div[class*='font-claude-response']";
  }

  createTextStream(
    content: HTMLElement,
    options: InputStreamOptions = { includeInitialText: false }
  ): ElementTextStream {
    return new ClaudeTextStream(content, options);
  }

  decorateControls(): MessageControls {
    return new ClaudeMessageControls(this, this.ttsControlsModule);
  }

  // Ensure non-streaming reads (e.g., voice intro) match streaming filters
  protected override extractReadableText(content: HTMLElement): string {
    return extractClaudeReadableText(content).trimEnd();
  }
}

export class ClaudeMessageControls extends MessageControls {
  constructor(message: AssistantResponse, ttsControls: TTSControlsModule) {
    super(message, ttsControls);
  }
  protected getExtraControlClasses(): string[] {
    return ["text-sm"];
  }
  getActionBarSelector(): string {
    return "div.flex.items-stretch";
  }
}

/**
 * A ClaudeTextBlockCapture is a simplified ElementTextStream that captures Claude's response
 * as a single block of text, rather than as individual paragraphs or list items.
 * This approach is slower than the ClaudeTextStream, but is more reliable and straightforward.
 */
export class ClaudeTextBlockCapture extends ElementTextStream {
  protected _numAdditions: number = 0;
  protected _textProcessedSoFar: string = "";
  private toolUseRoot: HTMLElement | null = null;
  private toolUseActive = false;
  private activeToolElement: HTMLElement | null = null;
  private seenToolElements = new WeakSet<HTMLElement>();
  private static readonly TOOL_CONTAINER_REQUIRED_CLASSES = [
    "rounded-lg",
    "border-0.5",
    "flex",
    "flex-col",
  ];
  private static readonly TOOL_CONTAINER_RECOMMENDED_CLASSES = [
    "border-border-300",
    "my-3",
  ];
  private static readonly TOOL_HEADER_CLASS_TOKEN = "group/row";

  handleMutationEvent(mutation: MutationRecord): void {
    if (mutation.type === "childList") {
      if (mutation.addedNodes.length > 0) {
        const { toolElement, sawRelevantNode } = this.findToolContainerFromAddedNodes(
          mutation.addedNodes as NodeListOf<Node>
        );
        if (toolElement) {
          this.updateToolUseState(toolElement);
        } else if (sawRelevantNode) {
          this.updateToolUseState(null);
        }
      }

      if (mutation.removedNodes.length > 0) {
        this.handleRemovedNodes(mutation.removedNodes as NodeListOf<Node>);
      }
      return;
    }

    if (mutation.type === "characterData") {
      const target = mutation.target;
      const possibleElement =
        target instanceof HTMLElement ? target : target.parentElement;
      if (!possibleElement) {
        return;
      }
      const container = this.findAncestorToolContainer(possibleElement);
      if (container) {
        this.updateToolUseState(container);
      } else if (this.toolUseActive) {
        this.updateToolUseState(null);
      }
    }
  }

  constructor(
    element: HTMLElement,
    options: InputStreamOptions = { includeInitialText: false }
  ) {
    super(element, options);

    const messageElement = element.parentElement;
    if (this.isClaudeTextStream(messageElement)) {
      const claudeMessage = messageElement as HTMLElement;
      this.toolUseRoot = claudeMessage;

      // check if Claude is already streaming text by the time we start observing it
      const isAlreadyStreaming = this.dataIsStreaming(claudeMessage);
      if (isAlreadyStreaming) {
        const initialText = this.getNestedText(element).trimEnd();
        EventBus.emit("saypi:llm:first-token", { text: initialText, time: Date.now() });
        this.handleTextAddition(initialText);
      }

      // now, continue observing for more streaming text, including completion
      let wasStreaming = isAlreadyStreaming;
      const messageObserver = new MutationObserver(() => {
        const streamingInProgress = this.dataIsStreaming(claudeMessage);
        const streamingStarted = !wasStreaming && streamingInProgress;
        const streamingStopped = wasStreaming && !streamingInProgress;
        const streamingText = this.getNestedText(element).trimEnd();
        if (streamingStarted) {
          EventBus.emit("saypi:llm:first-token", { text: streamingText, time: Date.now() });
          this.handleTextAddition(streamingText);
        } else if (streamingStopped) {
          this.handleTextAddition(streamingText, true);
          this.subject.complete();
        } else if (streamingInProgress) {
          this.handleTextAddition(streamingText);
        }
        wasStreaming = streamingInProgress;
        this.refreshToolUseStateFromDom();
      });
      messageObserver.observe(claudeMessage, {
        childList: false,
        subtree: false,
        characterData: false,
        attributes: true, // watch data-is-streaming
      });
    }

    this.refreshToolUseStateFromDom();
  }

  getNestedText(node: Node): string {
    return extractClaudeReadableText(node);
  }

  dataIsStreaming(element: HTMLElement | null): boolean {
    return (
      element !== null &&
      element.hasAttribute("data-is-streaming") &&
      element.getAttribute("data-is-streaming") === "true"
    );
  }

  override closed(): boolean {
    return super.closed() || !this.dataIsStreaming(this.element);
  }

  isClaudeTextStream(element: HTMLElement | null): boolean {
    return element !== null && element.hasAttribute("data-is-streaming");
  }

  handleTextAddition(allText: string, isFinal: boolean = false): void {
    this._textProcessedSoFar = allText;
    if (isFinal) {
      this.subject.next(new AddedText(allText));
    }
  }

  private updateToolUseState(nextElement: HTMLElement | null): void {
    if (nextElement) {
      if (this.toolUseActive && this.activeToolElement === nextElement) {
        return;
      }

      if (this.seenToolElements.has(nextElement)) {
        return;
      }

      this.toolUseActive = true;
      this.activeToolElement = nextElement;
      this.seenToolElements.add(nextElement);
      const label = this.extractToolLabel(nextElement);
      logger.debug(
        "Detected Claude tool use start",
        label ?? "(unknown tool)",
        nextElement
      );
      this.toolUseSubject.next({
        state: "start",
        label,
        element: nextElement,
      });
      return;
    }

    if (!this.toolUseActive) {
      return;
    }

    const activeLabel = this.activeToolElement
      ? this.extractToolLabel(this.activeToolElement)
      : undefined;
    this.toolUseActive = false;
    this.activeToolElement = null;
    logger.debug("Detected Claude tool use end", activeLabel ?? "(unknown tool)");
    this.toolUseSubject.next({ state: "stop" });
  }

  private handleRemovedNodes(removed: NodeListOf<Node>): void {
    if (!this.toolUseActive || !this.activeToolElement) {
      return;
    }
    for (const node of Array.from(removed)) {
      if (node.nodeType !== Node.ELEMENT_NODE) {
        continue;
      }
      const element = node as HTMLElement;
      if (element === this.activeToolElement || element.contains(this.activeToolElement)) {
        this.updateToolUseState(null);
        return;
      }
    }
  }

  private findToolContainerFromAddedNodes(nodes: NodeListOf<Node>): {
    toolElement: HTMLElement | null;
    sawRelevantNode: boolean;
  } {
    const observedRoot = this.getObservedRoot();
    const addedNodes = Array.from(nodes);
    let sawRelevantNode = false;

    for (let i = addedNodes.length - 1; i >= 0; i--) {
      const node = addedNodes[i];
      const element = this.getElementFromNode(node);
      if (!element) {
        continue;
      }

      if (!observedRoot.contains(element)) {
        continue;
      }

      sawRelevantNode = true;
      const toolContainer = this.findAncestorToolContainer(element);
      if (toolContainer) {
        return { toolElement: toolContainer, sawRelevantNode: true };
      }
    }

    return { toolElement: null, sawRelevantNode };
  }

  private getElementFromNode(node: Node): HTMLElement | null {
    if (node.nodeType === Node.ELEMENT_NODE) {
      return node as HTMLElement;
    }
    if (node.nodeType === Node.TEXT_NODE) {
      return (node as Text).parentElement;
    }
    return null;
  }

  private findAncestorToolContainer(start: HTMLElement | null): HTMLElement | null {
    const observedRoot = this.getObservedRoot();
    let current: HTMLElement | null = start;

    while (current && observedRoot.contains(current)) {
      if (this.isToolUseContainer(current)) {
        return current;
      }
      current = current.parentElement;
    }

    return null;
  }

  private getObservedRoot(): HTMLElement {
    return this.toolUseRoot ?? this.element;
  }

  private refreshToolUseStateFromDom(): void {
    const observedRoot = this.getObservedRoot();
    const candidates = Array.from(observedRoot.querySelectorAll("div"));
    let lastTool: HTMLElement | null = null;

    for (const candidate of candidates) {
      if (!(candidate instanceof HTMLElement)) {
        continue;
      }
      if (!this.isToolUseContainer(candidate)) {
        continue;
      }
      lastTool = candidate;
    }

    if (lastTool) {
      this.updateToolUseState(lastTool);
    } else if (this.toolUseActive) {
      this.updateToolUseState(null);
    }
  }

  private isToolUseContainer(element: HTMLElement): boolean {
    const classList = element.classList;
    const hasRequiredClasses = ClaudeTextBlockCapture.TOOL_CONTAINER_REQUIRED_CLASSES.every((cls) =>
      classList.contains(cls)
    );

    if (!hasRequiredClasses) {
      return false;
    }

    const hasRecommendedClasses = ClaudeTextBlockCapture.TOOL_CONTAINER_RECOMMENDED_CLASSES.every((cls) =>
      classList.contains(cls)
    );

    if (!hasRecommendedClasses) {
      return false;
    }

    const headerButton = this.findHeaderButton(element);

    if (!headerButton) {
      return false;
    }

    const headerClass = headerButton.getAttribute("class") ?? "";
    if (!headerClass.includes(ClaudeTextBlockCapture.TOOL_HEADER_CLASS_TOKEN)) {
      return false;
    }

    return true;
  }

  private extractToolLabel(element: HTMLElement): string | undefined {
    const ariaLabel = element.getAttribute("aria-label");
    if (ariaLabel && ariaLabel.trim().length > 0) {
      return ariaLabel.trim();
    }

    const headerButton = this.findHeaderButton(element);

    const textSource = headerButton ?? element;
    const textContent = textSource.textContent?.trim();
    if (!textContent) {
      return undefined;
    }

    const normalized = textContent.replace(/\s+/g, " ").trim();
    if (normalized.length === 0) {
      return undefined;
    }

    return normalized.length > 120 ? `${normalized.slice(0, 117)}...` : normalized;
  }

  private findHeaderButton(element: HTMLElement): HTMLElement | null {
    for (const child of Array.from(element.children)) {
      if (!(child instanceof HTMLElement)) {
        continue;
      }
      if (child.tagName === "BUTTON") {
        return child;
      }
    }
    return null;
  }
}

export class ClaudeTextStream extends ClaudeTextBlockCapture {
  constructor(element: HTMLElement, options: InputStreamOptions = { includeInitialText: false }) {
    super(element, options);
  }
  override handleTextAddition(allText: string, _isFinal: boolean = false): void {
    const unseenText = this.computeUnseenText(allText);
    this._numAdditions++;

    if (!unseenText) {
      return; // some chunks may be empty
    }
    this.subject.next(new AddedText(unseenText));
    this._textProcessedSoFar = allText;
  }

  private computeUnseenText(allText: string): string {
    if (!this._textProcessedSoFar) {
      return allText;
    }

    const indexOfPrevious = allText.indexOf(this._textProcessedSoFar);
    if (indexOfPrevious !== -1) {
      const prefix = allText.slice(0, indexOfPrevious);
      const suffix = allText.slice(indexOfPrevious + this._textProcessedSoFar.length);
      return prefix + suffix;
    }

    let commonPrefixLength = 0;
    const maxComparableLength = Math.min(this._textProcessedSoFar.length, allText.length);
    while (
      commonPrefixLength < maxComparableLength &&
      this._textProcessedSoFar.charAt(commonPrefixLength) === allText.charAt(commonPrefixLength)
    ) {
      commonPrefixLength++;
    }

    return allText.slice(commonPrefixLength);
  }
}
