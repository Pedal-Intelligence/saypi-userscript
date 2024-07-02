import { Observable, ReplaySubject, Subject } from "rxjs";
import { UserPreferenceModule } from "../prefs/PreferenceModule";
import { time } from "console";

export const STREAM_TIMEOUT: number = 10000; // visible for testing
const DATA_TIMEOUT = 1000;
const DEFAULT_ADDITIONAL_TIMEOUT = 0;
// Timeout values above base for different languages - derived from empirical testing on pi.ai
const LANGUAGE_TIMEOUTS: { [key: string]: number } = {
  en: 0,
  ar: 1250,
  de: 250,
  es: 250,
  fr: 1500,
  hi: 1500,
  it: 0,
  nl: 0,
  pl: 750,
  pt: 1000,
  ja: 1000,
  ko: 1250,
  ru: 2500,
  uk: 2250,
  zh: 0,
  bg: 1500,
  hr: 250,
  cs: 750,
  da: 1500,
  tl: 250,
  fi: 250,
  el: 1250,
  id: 0,
  ms: 1000,
  ro: 750,
  sk: 1000,
  sv: 1250,
  ta: 500,
  tr: 750,
};

function calculateDataTimeout(text: string, lang: string): number {
  // Extract the base language code (e.g., 'en' from 'en-US')
  const baseLanguage = lang.split("-")[0];

  const additionalTimeout =
    LANGUAGE_TIMEOUTS[baseLanguage] ?? DEFAULT_ADDITIONAL_TIMEOUT;
  const totalTime = DATA_TIMEOUT + additionalTimeout;
  console.debug(
    `Timeout for "${text}" in ${lang} (base: ${baseLanguage}) is ${totalTime}ms (${DATA_TIMEOUT} + ${additionalTimeout})`
  );
  return totalTime;
}

// Visible for testing
export function getNestedText(node: HTMLElement): string {
  return node.textContent ?? node.innerText ?? "";
}
export interface InputStreamOptions {
  includeInitialText?: boolean;
  delimiter?: string;
}
export interface TextContent {
  text: string;
  changed: boolean;
  changedFrom: string | null;
}

class TextItem implements TextContent {
  constructor(
    public text: string,
    public changed: boolean = false,
    public changedFrom: string | null = null
  ) {}
}

class AddedText extends TextItem {
  constructor(public text: string) {
    super(text, false, null);
  }
}

class ChangedText extends TextItem {
  constructor(public text: string, public changedFrom: string) {
    super(text, true, changedFrom);
  }
}

export class LateChangeEvent {
  constructor(
    public msAfterClose: number,
    public completion: Completion,
    public lang: string
  ) {}
}

type Completion = {
  type: "eod" | "timeout" | "disconnect";
  time: number;
};

export class ElementTextStream {
  protected subject: Subject<TextContent>;
  private lateChangeSubject = new Subject<LateChangeEvent>();
  protected observer!: MutationObserver;
  protected timeout: NodeJS.Timeout | undefined = undefined;
  protected emittedValues: TextContent[] = [];
  protected timeOfLastTextChange: number = Date.now();
  protected batchIntervalTimerId: NodeJS.Timeout | null = null;
  protected delimiter: string = "";
  protected languageGuess: string = ""; // the language of the content in the element - guessed from user preferences
  private completionReason: Completion | null = null;
  private completed = false; // whether the stream has completed (reduntant check for subject.closed)

  constructor(
    protected element: HTMLElement,
    { includeInitialText = false, delimiter = "" }: InputStreamOptions = {}
  ) {
    this.delimiter = delimiter;
    UserPreferenceModule.getInstance()
      .getLanguage()
      .then((lang) => {
        this.languageGuess = lang;
      });
    this.subject = new ReplaySubject<TextContent>(); // replay the last value to new subscribers (for initial text)
    // subscribe to keep track of emitted values
    this.subject.subscribe((value) => this.emittedValues.push(value));
    // subscribe to keep track of timeouts
    this.subject.subscribe({
      next: () => {
        this.timeOfLastTextChange = Date.now();
        this.resetStreamTimeout();
      },
      complete: () => {
        clearTimeout(this.timeout);
      },
    });
    this.resetStreamTimeout(); // set the initial timeout
    if (includeInitialText) {
      this.emitInitialText(element); // emit the initial text
    }
    this.registerObserver(); // start observing the element for additions
  }

  protected next(value: TextContent): void {
    if (this.closed()) {
      if (this.completionReason) {
        const timeElapsed = Date.now() - this.completionReason.time;
        console.debug(
          `Skipping next event for "${value.text}" because the stream has already completed on ${this.completionReason.type} ${timeElapsed}ms ago`
        );
      } else {
        console.debug(
          `Skipping next event for "${value.text}" because the stream was closed for no reason`
        );
      }
    } else {
      this.subject.next(value);
    }
  }

  protected complete(reason: Completion): void {
    if (this.closed()) {
      console.debug(
        `Cannot complete the stream on ${reason.type} because the stream has already been completed on ${this.completionReason?.type}`
      );
      return;
    }
    this.completionReason = reason;
    console.debug(
      `Completing stream on ${reason.type}`,
      this.element.id ? this.element.id : this.element
    );
    this.subject.complete();
    this.completed = true;
    //this.disconnect(); // stop observing the element - leave open for debugging
  }

  /**
   * Redundant check for the closed property of the subject
   * For some reason, the subject is not closed immediately after calling subject.complete(),
   * so we need to use our own flag to check if the stream is closed.
   * @returns true if the stream is closed, false otherwise
   */
  protected closed(): boolean {
    return this.subject.closed || this.completed;
  }

  private emitInitialText(message: HTMLElement): void {
    const initialText = getNestedText(message);
    // send the initial text to the stream only if it's not empty
    if (initialText) {
      this.next(new AddedText(initialText));
    }
  }

  /**
   * The stream will complete if no new text is streamed for a certain duration.
   * This method resets the timeout.
   */
  private resetStreamTimeout(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.complete({ type: "timeout", time: Date.now() });
    }, STREAM_TIMEOUT);
  }

  protected getTextIsStable(): boolean {
    return this.closed();
  }

  protected registerObserver(): void {
    let lastParagraphAdded = this.element.querySelectorAll("div")?.item(0);
    let spansAdded = 0;
    let spansRemoved = 0;
    let spansReplaced = 0;
    let stillChanging = false;

    const handleMutationEvent = (mutation: MutationRecord) => {
      if (this.closed()) {
        console.debug(
          `Skipping change event on ${mutation.target} because the stream has already been completed`,
          mutation
        );
        return;
      }

      if (mutation.type === "childList") {
        for (let i = 0; i < mutation.removedNodes.length; i++) {
          const node = mutation.removedNodes[i];
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            if (element.tagName === "SPAN") {
              spansRemoved++;
            }
          }
        }
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          stillChanging = true;
          const node = mutation.addedNodes[i];
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            if (element.tagName === "SPAN") {
              spansAdded++;
            } else if (element.tagName === "DIV") {
              const paragraph = element as HTMLDivElement;
              lastParagraphAdded = paragraph;
            }
          } else if (node.nodeType === Node.TEXT_NODE) {
            const textNode = node as Text;
            const content = textNode.textContent || "";
            this.next(new AddedText(content || ""));
            spansReplaced++;
            // we're finished when the paragraph has no more preliminary content
            const paragraph = textNode.parentElement;
            const spansRemaining =
              paragraph?.querySelectorAll("span")?.length || 0;
            const isFinalParagraph = paragraph === lastParagraphAdded;

            if (
              spansReplaced >= spansRemoved &&
              spansReplaced >= spansAdded &&
              spansRemaining === 0 &&
              isFinalParagraph
            ) {
              stillChanging = false;
              // complete soon if not still changing
              const startTime = Date.now();
              const additionsRemaining = mutation.addedNodes.length - i - 1;
              console.debug(
                `${startTime}: Possible end of stream detected on ${content}, ${additionsRemaining} additions remaining.`
              );
              setTimeout(() => {
                if (!stillChanging) {
                  const timeElapsed = Date.now() - startTime;
                  const lastContent = this.emittedValues.slice(-1)[0]?.text;
                  console.debug(
                    `${Date.now()}: end of stream confirmed on "${lastContent}" after +${timeElapsed}ms`
                  );
                  this.complete({ type: "eod", time: Date.now() });
                }
              }, calculateDataTimeout(content, this.languageGuess));
            }
          }
        }
      } else if (mutation.type === "characterData") {
        const textNode = mutation.target as Text;
        const content = textNode.textContent;
        // text node content changed from "${mutation.oldValue}" to "${content}"`
        // emit a change event only if the old value is present in the already emitted values
        const oldValue = mutation.oldValue || "";
        const alreadyEmitted = this.emittedValues.some(
          (value) => value.text === oldValue
        );
        if (alreadyEmitted) {
          stillChanging = true;
          this.next(new ChangedText(content || "", oldValue));
        } else {
          console.debug(
            `Skipping change event for "${content}" because the old value "${oldValue}" was not emitted`
          );
        }
      }
    };

    const contentMutationHandler = (mutationsList: MutationRecord[]) => {
      if (this.closed()) {
        const timeSinceCompletion = Date.now() - this.completionReason!.time;
        const warningMessage = `Content changed after the stream has closed. Try increasing the data timeout by at least ${timeSinceCompletion}ms for ${this.languageGuess}.`;
        console.warn(warningMessage);
        const lateChange = new LateChangeEvent(
          timeSinceCompletion,
          this.completionReason!,
          this.languageGuess
        );
        this.lateChangeSubject.next(lateChange);
        this.disconnect();
        return;
      }
      mutationsList.forEach((mutation) => handleMutationEvent(mutation));
    };

    this.observer = new MutationObserver(contentMutationHandler);
    this.observer.observe(this.element, {
      childList: true,
      subtree: true,
      characterData: true,
      characterDataOldValue: true,
    });
  }

  getStream(): Observable<TextContent> {
    return this.subject.asObservable();
  }

  getLateChangeStream(): Observable<LateChangeEvent> {
    return this.lateChangeSubject.asObservable();
  }

  disconnect(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.observer.disconnect();
    this.lateChangeSubject.complete();
  }

  // For testing purposes
  getObserver(): MutationObserver {
    return this.observer;
  }
}
