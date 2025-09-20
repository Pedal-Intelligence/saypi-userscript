import { AssistantResponse, MessageControls } from "../../dom/MessageElements";
import EventBus from "../../events/EventBus";
import { AddedText, ElementTextStream, InputStreamOptions } from "../../tts/InputStream";
import { TTSControlsModule } from "../../tts/TTSControlsModule";

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

  handleMutationEvent(_mutation: MutationRecord): void {
    // no-op for block capture
  }

  constructor(
    element: HTMLElement,
    options: InputStreamOptions = { includeInitialText: false }
  ) {
    super(element, options);

    const messageElement = element.parentElement;
    if (this.isClaudeTextStream(messageElement)) {
      const claudeMessage = messageElement as HTMLElement;

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
      });
      messageObserver.observe(claudeMessage, {
        childList: false,
        subtree: false,
        characterData: false,
        attributes: true, // watch data-is-streaming
      });
    }
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
}

export class ClaudeTextStream extends ClaudeTextBlockCapture {
  constructor(element: HTMLElement, options: InputStreamOptions = { includeInitialText: false }) {
    super(element, options);
    console.log(`[ClaudeTextStream] initialized on element: '${element.id}'`);
  }
  override handleTextAddition(allText: string, _isFinal: boolean = false): void {
    console.log(`[ClaudeTextStream] [handleTextAddition] [${this._numAdditions}] raw text: '${allText}'`);
    const unseenText = this.computeUnseenText(allText);
    console.log(`[ClaudeTextStream] [handleTextAddition] [${this._numAdditions}] unseen text: '${unseenText}'`);
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
