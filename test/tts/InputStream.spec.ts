import { expect, test, vi } from "vitest";
import { JSDOM } from "jsdom";
import {
  ElementTextStream,
  STREAM_TIMEOUT,
  TextContent,
  getNestedText,
} from "../../src/tts/InputStream";
import { PiTextStream } from "../../src/chatbots/Pi";

// Mock the UserPreferenceModule to prevent external API calls
vi.mock("../../src/prefs/PreferenceModule", () => {
  return {
    UserPreferenceModule: {
      getInstance: () => ({
        reloadCache: vi.fn(),
        getLanguage: vi.fn().mockResolvedValue("en-US"),
        isTTSBetaPaused: vi.fn().mockResolvedValue(false),
        getCachedIsTTSBetaPaused: vi.fn().mockReturnValue(false),
        getCachedAutoSubmit: vi.fn().mockReturnValue(true),
        getCachedAllowInterruptions: vi.fn().mockReturnValue(true),
        getStoredValue: vi.fn().mockImplementation((key, defaultValue) => Promise.resolve(defaultValue)),
        getTextToSpeechEnabled: vi.fn().mockResolvedValue(true),
      }),
    },
  };
});

const intervalMillis = 50; // delay between adding chunks of text

/**
 * Adds text to the element as if it was streamed from the server
 * In the following order:
 * - Add a hidden span with the text
 * @param element - The element to add text to
 * @param text - The text to add
 */
async function addText(element: HTMLElement, text: string) {
  await new Promise((resolve) => setTimeout(resolve, intervalMillis));
  const span = document.createElement("span");
  span.textContent = text;
  span.style.opacity = "0";
  element.appendChild(span);
}

/**
 * Finishes the text stream by replacing all hidden spans with text nodes
 * @param element - The element to finish the text stream on
 */
async function finishText(element: HTMLElement) {
  await new Promise((resolve) => setTimeout(resolve, intervalMillis));
  // replace all hidden spans with text nodes
  const spans = element.querySelectorAll("span") as NodeListOf<HTMLSpanElement>;
  spans.forEach((span) => {
    span.replaceWith(document.createTextNode(span.textContent || ""));
  });
}

async function addParagraph(element: HTMLElement, text: string) {
  await new Promise((resolve) => setTimeout(resolve, intervalMillis));
  const p = document.createElement("div");
  element.appendChild(p);
  addText(p, text);
}

async function collectStreamValues(
  stream: ElementTextStream,
  values: string[]
): Promise<void> {
  return new Promise<void>((resolve) => {
    stream.getStream().subscribe({
      next: (val: TextContent) => {
        values.push(val.text);
      },
      complete: () => {
        resolve();
      },
    });
  });
}

export function timeoutCalc(wc: number) {
  const maxLanguageDelay = 3000;
  return wc * intervalMillis + STREAM_TIMEOUT + maxLanguageDelay;
}

test("getNestedText returns the correct text", () => {
  const container = document.createElement("div");
  container.innerHTML =
    "<p id='greeting'>Hello, <span class='subject' style='display: none'>World!</span> \
<span>It's nice to see you again.</span></p>";
  const greeting = container.querySelector("#greeting") as HTMLElement;
  const actualText = getNestedText(greeting);
  expect(actualText).toBe("Hello, World! It's nice to see you again.");
});

test(
  "ElementTextStream emits text as it is added",
  async () => {
    const element = document.createElement("div");
    const stream = new PiTextStream(element);
    const values: string[] = [];
    const promise = collectStreamValues(stream, values);
    await addText(element, "Hello ");
    await addText(element, "world");
    await finishText(element);
    await promise;
    expect(values).toEqual(["Hello ", "world"]);
  },
  timeoutCalc(2)
);

test(
  "ElementTextStream emits more text as it is added",
  async () => {
    const element = document.createElement("div");
    document.body.appendChild(element);
    const stream = new PiTextStream(element);
    const values: string[] = [];
    const promise = collectStreamValues(stream, values);

    await addText(element, "Hello ");
    await addText(element, "world ");
    await addText(element, "you're ");
    await addText(element, "looking ");
    await addText(element, "great");
    await finishText(element);

    // Wait for the Observable to complete
    await promise;
    expect(values).toEqual([
      "Hello ",
      "world ",
      "you're ",
      "looking ",
      "great",
    ]);
  },
  timeoutCalc(5)
);

test(
  "Paragraphs are separated by only the specified delimiter",
  async () => {
    const element = document.createElement("div");
    document.body.appendChild(element);
    const stream = new PiTextStream(element); // no delimiter by default
    const values: string[] = [];
    const promise = collectStreamValues(stream, values);

    await addParagraph(element, "Hello there!");
    await addParagraph(element, "I have doubled in power since we last met.");
    await finishText(element);

    // Wait for the Observable to complete
    await promise;
    expect(values).toEqual([
      "Hello there!",
      "I have doubled in power since we last met.",
    ]);
  },
  timeoutCalc(2)
);


test(
  "Streamed text should equal the text in the element",
  async () => {
    const element = document.createElement("div");
    document.body.appendChild(element);
    const stream = new PiTextStream(element);
    const values: string[] = [];
    const promise = collectStreamValues(stream, values);

    addText(element, "Hello ");
    addText(element, "world.");
    await finishText(element);
    await promise;
    expect(values.join("")).toEqual(element.textContent);
  },
  timeoutCalc(2)
);

