import { replaceEllipsisWithSpace, shortenTranscript } from "../src/TextModule";

describe("TextModule", function () {
  describe("replace ellipsis with space", function () {
    it("should replace ellipsis followed by space and uppercase letter with space and lowercase letter", function () {
      const testCases = [
        {
          input: "Where did I leave my... Glasses?",
          expected: "Where did I leave my glasses?",
        },
        {
          input: "What's for... Dinner tonight?",
          expected: "What's for dinner tonight?",
        },
        {
          input: "I'm not sure... Maybe we should ask... Someone else.",
          expected: "I'm not sure maybe we should ask someone else.",
        },
        { input: "No ellipsis here", expected: "No ellipsis here" },
      ];

      testCases.forEach((testCase) => {
        const result = replaceEllipsisWithSpace(testCase.input);
        expect(result).toEqual(testCase.expected);
      });
    });
  });

  describe("shorten transcript", function () {
    it("should truncate from the start when text exceeds limit", function () {
      const testCases = [
        {
          input: "foobar",
          limit: 4,
          expected: "…bar"
        },
        {
          input: "hello world",
          limit: 6,
          expected: "…world"
        },
        {
          input: "short",
          limit: 5,
          expected: "short"
        },
        {
          input: "test",
          limit: 10,
          expected: "test"
        }
      ];

      testCases.forEach((testCase) => {
        const result = shortenTranscript(testCase.input, testCase.limit);
        expect(result).toEqual(testCase.expected);
      });
    });
  });
});
