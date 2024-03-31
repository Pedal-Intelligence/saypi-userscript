import { expect, test } from "vitest";
import { JSDOM } from "jsdom";
import { toArray } from "rxjs/operators";
import { ElementTextStream } from "../../src/tts/InputStream";

test("ElementTextStream emits inner text of added nodes", async () => {
  const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
  global.MutationObserver = dom.window.MutationObserver;
  global.Node = dom.window.Node; // get Node from jsdom, required for ElementTextStream
  const element = dom.window.document.querySelector("p") as HTMLElement;
  const stream = new ElementTextStream(element);
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
});

test("ElementTextStream resets timeout when new input is available", async () => {
  const dom = new JSDOM(`<!DOCTYPE html><p></p>`);
  global.MutationObserver = dom.window.MutationObserver;
  global.Node = dom.window.Node;
  const element = dom.window.document.querySelector("p") as HTMLElement;
  const stream = new ElementTextStream(element);
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
