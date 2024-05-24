import { expect, test, beforeEach } from "vitest";
import { JSDOM } from "jsdom";
import { toArray } from "rxjs/operators";
import {
  ElementTextStream,
  STREAM_TIMEOUT_MS,
  getNestedText,
} from "../../src/tts/InputStream";

const intervalMillis = 100; // delay between adding text

async function addText(element: HTMLElement, text: string, inline = true) {
  await new Promise((resolve) => setTimeout(resolve, intervalMillis));
  const container = document.createElement(inline ? "span" : "div");
  element.appendChild(container).textContent = text;
}

async function collectStreamValues(
  stream: ElementTextStream,
  values: string[]
): Promise<void> {
  return new Promise<void>((resolve) => {
    stream.getStream().subscribe({
      next: (val) => {
        values.push(val);
      },
      complete: () => {
        resolve();
      },
    });
  });
}

function timeoutCalc(wc: number) {
  return wc * intervalMillis + STREAM_TIMEOUT_MS;
}

beforeEach(() => {
  const dom = new JSDOM();
  global.document = dom.window.document;
  global.MutationObserver = dom.window.MutationObserver;
  global.Node = dom.window.Node;
  global.NodeList = dom.window.NodeList;
  global.Element = dom.window.Element;
});

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
    const stream = new ElementTextStream(element);
    const values: string[] = [];
    const promise = collectStreamValues(stream, values);
    await addText(element, "Hello");
    await addText(element, "world");
    await promise;
    expect(values).toEqual(["Hello", "world"]);
  },
  timeoutCalc(2)
);

test(
  "ElementTextStream emits inner text of added nodes",
  async () => {
    const element = document.createElement("div");
    document.body.appendChild(element);
    const stream = new ElementTextStream(element);
    const values: string[] = [];
    const promise = collectStreamValues(stream, values);

    await addText(element, "Hello");
    await addText(element, "world");
    await addText(element, "you're");
    await addText(element, "looking");
    await addText(element, "great");

    // Wait for the Observable to complete
    await promise;
    expect(values).toEqual(["Hello", "world", "you're", "looking", "great"]);
  },
  timeoutCalc(5)
);

test("Paragraphs are separated by newlines", async () => {
  const element = document.createElement("div");
  document.body.appendChild(element);
  const stream = new ElementTextStream(element);
  const values: string[] = [];
  const promise = collectStreamValues(stream, values);

  const inline = false;
  await addText(element, "Hello there!", inline);
  await addText(element, "I have doubled in power since we last met.", inline);

  // Wait for the Observable to complete
  await promise;
  expect(values).toEqual([
    "Hello there!",
    "\n",
    "I have doubled in power since we last met.",
  ]);
});
