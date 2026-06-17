import { AssistantResponse, MessageControls } from "../../dom/MessageElements";
import EventBus from "../../events/EventBus";
import {
  AddedText,
  ChangedText,
  Completion,
  ElementTextStream,
  InputStreamOptions,
  STREAM_TIMEOUT,
  getNestedText,
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

        // No copy button on Pi: pi.ai ships its own native "Copy message" button
        // in the action bar, so ours would be redundant. (Other chatbots still
        // get theirs via the shared MessageControls path.) pi.scss also hides any
        // copy button left on messages decorated by an older build.

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
  // Endpointing window: complete once the rendered text stops changing.
  private streamTimeoutMs: number | undefined;
  // Extra endpointing delay accumulated from "saypi:tts:text:delay" events.
  private additionalDelay: number = 0;
  // The full rendered text already emitted, diffed against on each mutation.
  private lastFullText: string = "";
  private firstTokenEmitted: boolean = false;

  constructor(element: HTMLElement, options?: InputStreamOptions) {
    super(element, options);
    this.streamTimeoutMs = options?.streamTimeout ?? STREAM_TIMEOUT;
    // If the base already emitted the element's initial text, seed lastFullText
    // so we don't re-emit it on the first mutation.
    if (options?.includeInitialText) {
      this.lastFullText = getNestedText(this.element);
    }
    EventBus.on("saypi:tts:text:delay", this.handleDelayEvent);
    // Re-arm the completion timer now that streamTimeoutMs is set (the base
    // constructor armed it with the default before this ran).
    this.resetStreamTimeout();
  }

  /** Endpointing window, extended by any received delay events. */
  protected calculateStreamTimeout(): number {
    return (this.streamTimeoutMs ?? STREAM_TIMEOUT) + (this.additionalDelay || 0);
  }

  /**
   * pi.ai gives no explicit end-of-response marker, so complete the stream once
   * the rendered text has been stable for the endpointing window. The base
   * subscription re-arms this on every emitted chunk, so it fires only after
   * streaming actually stops.
   */
  protected resetStreamTimeout(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.complete({ type: "eod", time: Date.now() });
    }, this.calculateStreamTimeout());
  }

  /** Extend the endpointing window when a delay event is received. */
  handleDelayEvent = () => {
    this.additionalDelay += 1500;
    this.resetStreamTimeout();
  };

  /**
   * pi.ai streams a response by appending hidden `<span style="opacity:0">`
   * word chunks (revealed later) and tweaking them via characterData — it does
   * NOT append bare text nodes, and the first chunk arrives already nested in a
   * container element. Rather than interpret each node mutation (the old, now
   * broken approach), read the element's full rendered text on every mutation
   * and emit the delta. This is robust to however the host nests or streams the
   * text, and naturally handles appends, in-place edits, and nested containers.
   */
  handleMutationEvent = (_mutation: MutationRecord) => {
    if (this.closed()) {
      return;
    }
    const full = getNestedText(this.element);
    if (full === this.lastFullText) {
      return;
    }
    if (full.startsWith(this.lastFullText)) {
      const delta = full.slice(this.lastFullText.length);
      this.lastFullText = full;
      if (!this.firstTokenEmitted && delta.trim().length > 0) {
        this.firstTokenEmitted = true;
        EventBus.emit("saypi:llm:first-token", { text: delta, time: Date.now() });
      }
      this.next(new AddedText(delta));
    } else {
      // Rare: earlier text was rewritten rather than appended to.
      const previous = this.lastFullText;
      this.lastFullText = full;
      this.next(new ChangedText(full, previous));
    }
  };

  complete(reason: Completion): void {
    super.complete(reason);
    EventBus.off("saypi:tts:text:delay", this.handleDelayEvent);
  }
}
