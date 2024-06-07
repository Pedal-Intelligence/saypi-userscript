import { md5 } from "js-md5";
import { ElementTextStream } from "../tts/InputStream";
import { SpeechUtterance } from "../tts/SpeechModel";

class AssistantResponse {
  private _element: HTMLElement;
  private stablised: boolean = false;
  private finalText: string = "";
  // visible for testing
  static PARAGRAPH_SEPARATOR = ""; // should match ElementInputStream's delimiter argument
  protected includeInitialText = true; // stable text may be called on completed messages, so include the initial text unless streaming

  constructor(element: HTMLElement, includeInitialText = true) {
    this._element = element;
    this.decorate();
  }

  private decorate(): void {
    this._element.classList.add("chat-message", "assistant-message");
    this.decoratedContent();
  }

  /**
   * Waits for the content of the chat message to load and returns it
   * The content is the main text of the chat message, excluding any metadata or buttons
   * @returns Promise<HTMLElement> - the content of the chat message
   */
  async decoratedContent(): Promise<HTMLElement> {
    const content = this._element.querySelector(".content");
    if (content) {
      // content already found and decorated
      return content as HTMLElement;
    }
    const wfull = this._element.querySelector(".w-full");
    if (wfull) {
      // content found but not decorated yet
      wfull.classList.add("content");
      return wfull as HTMLElement;
    }
    // content not found, wait for it to load
    return new Promise((resolve) => {
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          for (const node of [...mutation.addedNodes]) {
            if (node instanceof HTMLElement) {
              const addedElement = node as HTMLElement;
              // TODO: w-full is specific to Pi.ai, should be generalized with Chatbot parameter
              if (addedElement.classList.contains("w-full")) {
                addedElement.classList.add("content");
                observer.disconnect();
                resolve(addedElement);
              }
            }
          }
        }
      });
      observer.observe(this._element, { childList: true, subtree: true });
    });
  }

  /**
   * Get the text content of the chat message,
   * as it is at the time of calling this method, which may not be completely loaded if the response is still streaming
   * Get stableText() to get the finished text content of the chat message
   */
  get text(): string {
    const contentNode = this._element.querySelector(".content");
    if (contentNode) {
      const content = contentNode as HTMLElement;
      const textContent = content.innerText || content.textContent || "";
      return textContent.replace(/\n/g, AssistantResponse.PARAGRAPH_SEPARATOR);
    }
    return "";
  }

  async stableText(): Promise<string> {
    if (this.stablised) {
      return this.finalText;
    }
    const content = await this.decoratedContent();
    const textStream = new ElementTextStream(content, this.includeInitialText);
    const textBuffer: string[] = [];
    return new Promise((resolve) => {
      textStream.getStream().subscribe({
        next: (text) => {
          textBuffer.push(text);
        },
        complete: () => {
          this.stablised = true;
          this.finalText = textBuffer.join("");
          resolve(this.finalText);
        },
      });
    });
  }

  /**
   * Get the md5 hash of the text content of the chat message
   * Use this function only if you know the text content is already stable,
   * otherwise get stableHash() to get the hash of the final text content
   */
  get hash(): string {
    // return a md5 hash of the text content
    return md5(this.text);
  }

  async stableHash(): Promise<string> {
    // return a md5 hash of the text content
    const stableText = await this.stableText();
    return md5(stableText);
  }

  get element(): HTMLElement {
    return this._element;
  }

  get utteranceId(): string | null {
    return this._element.dataset.utteranceId || null;
  }

  get isTTSEnabled(): boolean {
    return this.utteranceId !== null;
  }

  enableTTS(utterance: SpeechUtterance): void {
    this._element.dataset.utteranceId = utterance.id;
    this._element.classList.add("speech-enabled");
  }
}

export { AssistantResponse };
