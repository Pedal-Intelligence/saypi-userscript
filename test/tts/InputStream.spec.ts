import { expect, test, beforeEach } from "vitest";
import { JSDOM } from "jsdom";
import { toArray } from "rxjs/operators";
import {
  ElementTextStream,
  ELEMENT_TEXT_STREAM_TIMEOUT_DURATION_MILLIS,
  getNestedText,
} from "../../src/tts/InputStream";
import { interval } from "rxjs";

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
    const element = dom.window.document.createElement("div");
    dom.window.document.body.appendChild(element);
    stream = new ElementTextStream(element);
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
    const hello = dom.window.document.createElement("span");
    hello.textContent = "Hello";
    element.appendChild(hello);
    const world = dom.window.document.createElement("span");
    world.textContent = "world";
    element.appendChild(world);
    // Wait for the Observable to complete
    await promise.then(() => {
      expect(values).toEqual(["Hello", "world"]);
    });
  },
  ELEMENT_TEXT_STREAM_TIMEOUT_DURATION_MILLIS + 1000
);

test(
  "ElementTextStream resets timeout when new input is available",
  async () => {
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
        element.appendChild(
          dom.window.document.createElement("span")
        ).textContent = "Hello";
      }
    );
    // Wait for a bit before adding the second node, and so on...
    await new Promise((resolve) => setTimeout(resolve, intervalMillis)).then(
      () => {
        element.appendChild(
          dom.window.document.createElement("span")
        ).textContent = "world";
      }
    );
    await new Promise((resolve) => setTimeout(resolve, intervalMillis)).then(
      () => {
        element.appendChild(
          dom.window.document.createElement("span")
        ).textContent = "you're";
      }
    );
    await new Promise((resolve) => setTimeout(resolve, intervalMillis)).then(
      () => {
        element.appendChild(
          dom.window.document.createElement("span")
        ).textContent = "looking";
      }
    );
    await new Promise((resolve) => setTimeout(resolve, intervalMillis)).then(
      () => {
        element.appendChild(
          dom.window.document.createElement("span")
        ).textContent = "great";
      }
    );
    // Wait for the Observable to complete
    await promise.then(() => {
      expect(values).toEqual(["Hello", "world", "you're", "looking", "great"]);
    });
  },
  800 * 5 + ELEMENT_TEXT_STREAM_TIMEOUT_DURATION_MILLIS + 1000
);
