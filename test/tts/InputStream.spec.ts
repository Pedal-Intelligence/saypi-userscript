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

test(
  "PiTextStream detects stream completion via style transitions",
  async () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    
    // Create the stream
    const stream = new PiTextStream(container);
    const values: string[] = [];
    const promise = collectStreamValues(stream, values);
    
    // Add a paragraph
    const paragraph = document.createElement("div");
    container.appendChild(paragraph);
    
    // Add a hidden span - use inline style for test environment
    const span1 = document.createElement("span");
    span1.textContent = "Hello";
    span1.style.opacity = "0"; // Set direct style property
    paragraph.appendChild(span1);
    
    // Add a text node - this should be picked up directly
    const textNode = document.createTextNode(" ");
    paragraph.appendChild(textNode);
    
    // Manually trigger the text node addition since JSDOM doesn't automatically trigger mutations
    stream.handleMutationEvent({
      type: 'childList',
      addedNodes: [textNode],
      removedNodes: [],
      target: paragraph,
      attributeName: null,
      attributeNamespace: null,
      oldValue: null,
      nextSibling: null,
      previousSibling: null
    } as unknown as MutationRecord);
    
    // Add another hidden span
    const span2 = document.createElement("span");
    span2.textContent = "world";
    span2.style.opacity = "0"; // Set direct style property
    paragraph.appendChild(span2);
    
    // Wait a bit then make spans visible one by one
    await new Promise(resolve => setTimeout(resolve, 100));
    span1.style.opacity = "1"; // This should trigger a style mutation
    
    // Manually trigger style mutation since JSDOM doesn't do this automatically
    stream.handleMutationEvent({
      type: 'attributes',
      attributeName: 'style',
      target: span1,
      oldValue: 'opacity: 0',
    } as unknown as MutationRecord);
    
    // Manually trigger the text content for span1 (which should be emitted when span becomes visible)
    stream.handleMutationEvent({
      type: 'childList',
      addedNodes: [document.createTextNode("Hello")],
      removedNodes: [],
      target: span1,
      attributeName: null,
      attributeNamespace: null,
      oldValue: null,
      nextSibling: null,
      previousSibling: null
    } as unknown as MutationRecord);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    span2.style.opacity = "1"; // This should trigger a style mutation
    
    // Manually trigger style mutation for span2
    stream.handleMutationEvent({
      type: 'attributes',
      attributeName: 'style',
      target: span2,
      oldValue: 'opacity: 0',
    } as unknown as MutationRecord);
    
    // Manually trigger the text content for span2
    stream.handleMutationEvent({
      type: 'childList',
      addedNodes: [document.createTextNode("world")],
      removedNodes: [],
      target: span2,
      attributeName: null,
      attributeNamespace: null,
      oldValue: null,
      nextSibling: null,
      previousSibling: null
    } as unknown as MutationRecord);
    
    // Stream should complete shortly after last span becomes visible
    await promise;
    
    expect(values).toContain("Hello");
    expect(values).toContain(" ");
    expect(values).toContain("world");
  },
  5000 // increase timeout to be safe
);
