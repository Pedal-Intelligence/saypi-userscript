import { expect } from "chai";
import { replaceEllipsisWithSpace } from "../src/TextModule.js";

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
        expect(result).to.equal(testCase.expected);
      });
    });
  });
});
