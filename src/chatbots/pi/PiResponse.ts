import { AssistantResponse, MessageControls } from "../../dom/MessageElements";
import EventBus from "../../events/EventBus";
import {
  AddedText,
  ChangedText,
  Completion,
  ElementTextStream,
  InputStreamOptions,
} from "../../tts/InputStream";
import { UserPreferenceModule } from "../../prefs/PreferenceModule";
import { TTSControlsModule } from "../../tts/TTSControlsModule";

export class PiResponse extends AssistantResponse {
  constructor(element: HTMLElement, includeInitialText?: boolean) {
    super(element, includeInitialText);
  }

  get contentSelector(): string {
    return "div.w-full";
  }

  createTextStream(
    content: HTMLElement,
    options?: InputStreamOptions
  ): ElementTextStream {
    return new PiTextStream(content, options);
  }

  decorateControls(): MessageControls {
    return new PiMessageControls(this, TTSControlsModule.getInstance());
  }
}

export class PiMessageControls extends MessageControls {
  constructor(message: AssistantResponse, ttsControls: TTSControlsModule) {
    super(message, ttsControls);
  }

  protected getExtraControlClasses(): string[] {
    return ["pt-4", "text-neutral-500", "text-sm"];
  }

  getActionBarSelector(): string {
    return "div[style]:last-of-type"; // last div child of the message element (usually the second child)
  }

  // Pi requires us to inject our own controls into the action bar
  protected override async decorateControls(message: AssistantResponse): Promise<void> {
    return new Promise((resolve) => {
      const attach = () => {
        let bar = this.findActionBar();
        if (!bar) {
          bar = message.element.querySelector(this.getActionBarSelector()) as HTMLElement | null;
          if (bar) {
            bar.classList.add("message-action-bar");
            this.actionBar = bar;
          } else {
            // Wait until message action bar appears
            const observer = new MutationObserver(() => {
              const candidate = message.element.querySelector(this.getActionBarSelector()) as HTMLElement | null;
              if (candidate) {
                candidate.classList.add("message-action-bar");
                this.actionBar = candidate;
                observer.disconnect();
                attach();
              }
            });
            observer.observe(message.element, { childList: true, subtree: true });
            return;
          }
        }

        let msgCtrlsElement = message.element.querySelector(
          ".saypi-tts-controls"
        ) as HTMLDivElement | null;
        if (!msgCtrlsElement) {
          msgCtrlsElement = document.createElement("div");
          msgCtrlsElement.classList.add(
            "saypi-tts-controls",
            ...this.getExtraControlClasses()
          );
          this.actionBar?.appendChild(msgCtrlsElement);
        }
        this.messageControlsElement = msgCtrlsElement;

        const copyButtonElement =
          msgCtrlsElement.querySelector(".saypi-copy-button");
        if (!copyButtonElement) {
          this.ttsControls.addCopyButton(this.message, msgCtrlsElement);
        }

        // Add telemetry button at the end
        const telemetryButtonElement =
          msgCtrlsElement.querySelector(".saypi-telemetry-button");
        if (!telemetryButtonElement) {
          setTimeout(() => {
            const telemetryButton = this.createTelemetryButton();
            msgCtrlsElement!.appendChild(telemetryButton);
          }, 0);
        }

        resolve();
      };
      attach();
    });
  }
}

export class PiTextStream extends ElementTextStream {
  hiddenTextQueue: Queue<string> = new Queue();
  additionalDelay: number = 0;
  lastContentChange: number = Date.now();

  constructor(element: HTMLElement, options?: InputStreamOptions) {
    super(element, options);
    EventBus.on("saypi:tts:text:delay", this.handleDelayEvent);
  }

  // Helper to check if a span is hidden
  private isSpanHidden(span: HTMLSpanElement): boolean {
    try {
      if (span.style.display === "none" || span.style.opacity === "0") {
        return true;
      }
      if (typeof window !== 'undefined' && window.getComputedStyle) {
        const style = window.getComputedStyle(span);
        return style.display === "none" || parseFloat(style.opacity) === 0;
      }
      return false;
    } catch (e) {
      console.error("Error checking if span is hidden", e);
      return false;
    }
  }

  /** Extend the stream timeout when a delay event is received. */
  handleDelayEvent = () => {
    const delay = 1500;
    this.additionalDelay += delay;
    console.debug(`Received delay event. Adding ${delay}ms to timeout. Total additional delay: ${this.additionalDelay}ms`);
    this.resetStreamTimeout();
  };

  private updateLastContentChange(): void {
    this.lastContentChange = Date.now();
  }

  handleMutationEvent = (mutation: MutationRecord) => {
    if (this.closed()) {
      return;
    }

    this.updateLastContentChange();

    if (mutation.type === "childList") {
      for (let i = 0; i < mutation.addedNodes.length; i++) {
        const node = mutation.addedNodes[i];

        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as HTMLElement;
          if (element.tagName === "SPAN") {
            const isHidden = this.isSpanHidden(element as HTMLSpanElement);
            if (isHidden) {
              if (this.hiddenTextQueue.isEmpty()) {
                EventBus.emit("saypi:llm:first-token", { text: element.textContent || "", time: Date.now() });
              }
              this.hiddenTextQueue.enqueue(element.textContent || "");
            }
          }
        } else if (node.nodeType === Node.TEXT_NODE) {
          const textNode = node as Text;
          const content = textNode.textContent || "";

          const head = this.hiddenTextQueue.peek();
          if (head) {
            if (head.trim() === content.trim()) {
              this.hiddenTextQueue.dequeue();
            }
          }
          this.next(new AddedText(content || ""));

          if (this.hiddenTextQueue.isEmpty()) {
            console.debug("Stream completion detected - all hidden text has been added");
            this.complete({ type: "eod", time: Date.now() });
          }
        }
      }
    } else if (mutation.type === "characterData") {
      const textNode = mutation.target as Text;
      const content = textNode.textContent || "";
      const oldValue = mutation.oldValue || "";

      const alreadyEmitted = this.emittedValues.some((value) => value.text === oldValue);
      if (alreadyEmitted) {
        this.next(new ChangedText(content, oldValue));
        console.debug(`Text changed from "${oldValue}" to "${content}"`);
      } else {
        console.debug(`Skipping change event for "${content}" because the old value "${oldValue}" was not emitted`);
      }
    }
  };

  complete(reason: Completion): void {
    super.complete(reason);
    EventBus.off("saypi:tts:text:delay", this.handleDelayEvent);
  }
}

class Queue<T> {
  private items: T[] = [];
  enqueue(item: T): void { this.items.push(item); }
  dequeue(): T | undefined { return this.items.shift(); }
  peek(): T | undefined { return this.items[0]; }
  get size(): number { return this.items.length; }
  isEmpty(): boolean { return this.items.length === 0; }
}
