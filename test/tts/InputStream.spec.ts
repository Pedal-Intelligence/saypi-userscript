import { expect, test, beforeEach } from "vitest";
import { JSDOM } from "jsdom";
import { toArray } from "rxjs/operators";
import {
  ElementTextStream,
  ELEMENT_TEXT_STREAM_TIMEOUT_DURATION_MILLIS,
  getNestedText,
} from "../../src/tts/InputStream";

let dom: JSDOM;
let element: HTMLElement;
let stream: ElementTextStream;

beforeEach(() => {
  dom = new JSDOM(`<!DOCTYPE html><p></p>`);
  global.MutationObserver = dom.window.MutationObserver;
  global.Node = dom.window.Node;
  element = dom.window.document.querySelector("p") as HTMLElement;
  stream = new ElementTextStream(element);
});

test("getNestedText returns the correct text", () => {
  const container = dom.window.document.createElement("div");
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
    const values: string[] = [];
    const promise = new Promise<void>((resolve) => {
      stream
        .getStream()
        .pipe(toArray())
        .subscribe((val: string[]) => {
          values.push(...val);
          resolve();
        });
    });
    const newNode1 = dom.window.document.createElement("span");
    newNode1.innerText = "Hello";
    element.appendChild(newNode1);
    const newNode2 = dom.window.document.createElement("span");
    newNode2.innerText = "world";
    element.appendChild(newNode2);
    // Wait for the Observable to complete
    await promise.then(() => {
      expect(values).toEqual(["Hello", "world"]);
    });
  },
  ELEMENT_TEXT_STREAM_TIMEOUT_DURATION_MILLIS * 3
);

test("ElementTextStream resets timeout when new input is available", async () => {
  const values: string[] = [];
  const start = Date.now();
  const promise = new Promise<void>((resolve) => {
    stream
      .getStream()
      .pipe(toArray())
      .subscribe((val: string[]) => {
        values.push(...val);
        console.log(`Received ${val} after ${Date.now() - start}ms`);
        resolve();
      });
  });
  const intervalMillis = 800;
  // Wait for a bit before adding the node
  await new Promise((resolve) => setTimeout(resolve, intervalMillis)).then(
    () => {
      element.appendChild(dom.window.document.createElement("span")).innerText =
        "Hello";
    }
  );
  // Wait for a bit before adding the second node, and so on...
  await new Promise((resolve) => setTimeout(resolve, intervalMillis)).then(
    () => {
      element.appendChild(dom.window.document.createElement("span")).innerText =
        "world";
    }
  );
  await new Promise((resolve) => setTimeout(resolve, intervalMillis)).then(
    () => {
      element.appendChild(dom.window.document.createElement("span")).innerText =
        "you're";
    }
  );
  await new Promise((resolve) => setTimeout(resolve, intervalMillis)).then(
    () => {
      element.appendChild(dom.window.document.createElement("span")).innerText =
        "looking";
    }
  );
  await new Promise((resolve) => setTimeout(resolve, intervalMillis)).then(
    () => {
      element.appendChild(dom.window.document.createElement("span")).innerText =
        "great";
    }
  );
  // Wait for the Observable to complete
  await promise.then(() => {
    expect(values).toEqual(["Hello", "world", "you're", "looking", "great"]);
  });
}, 9000);
