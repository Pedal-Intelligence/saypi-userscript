import { expect, test } from "vitest";
import { JSDOM } from "jsdom";
import { toArray } from "rxjs/operators";
import { ElementTextStream } from "../../src/tts/InputStream";

test("ElementTextStream emits inner text of added nodes", async () => {
  const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
  global.MutationObserver = dom.window.MutationObserver;
  const element = dom.window.document.querySelector("p") as HTMLElement;

  const stream = new ElementTextStream(element);
  const values: string[] = [];

  stream
    .getStream()
    .pipe(toArray())
    .forEach((val: string[]) => values.push(...val));

  const newNode1 = dom.window.document.createElement("span");
  newNode1.innerText = "Hello";
  element.appendChild(newNode1);

  const newNode2 = dom.window.document.createElement("span");
  newNode2.innerText = "world";
  element.appendChild(newNode2);

  // Disconnect the observer to complete the stream
  stream.disconnect();

  expect(values).toEqual(["Hello", "world"]);
});
