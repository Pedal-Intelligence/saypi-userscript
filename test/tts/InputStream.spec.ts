import { expect, test } from "vitest";
import { JSDOM } from "jsdom";
import {
  ElementTextStream,
  STREAM_TIMEOUT,
  TextContent,
  getNestedText,
} from "../../src/tts/InputStream";
import { PiTextStream } from "../../src/chatbots/Pi";

const intervalMillis = 100; // delay between adding text

async function addText(element: HTMLElement, text: string) {
  await new Promise((resolve) => setTimeout(resolve, intervalMillis));
  element.appendChild(document.createTextNode(text));
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
  "ElementTextStream emits inner text of added nodes",
  async () => {
    const element = document.createElement("div");
    const stream = new PiTextStream(element);
    const values: string[] = [];
    const promise = collectStreamValues(stream, values);
    await addText(element, "Hello ");
    await addText(element, "world");
    await promise;
    expect(values).toEqual(["Hello ", "world"]);
  },
  timeoutCalc(2)
);

test(
  "ElementTextStream emits inner text of added nodes",
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
  "Preexisting text is emitted immediately if requested",
  async () => {
    const element = document.createElement("div");
    element.textContent = "Hello, world!";
    document.body.appendChild(element);
    const includeInitialText = true;
    const options = { includeInitialText };
    const stream = new PiTextStream(element, options);
    const values: string[] = [];
    const promise = collectStreamValues(stream, values);
    await promise;
    expect(values).toEqual(["Hello, world!"]);
  },
  timeoutCalc(1)
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
    await promise;
    expect(values.join("")).toEqual(element.textContent);
  },
  timeoutCalc(2)
);
