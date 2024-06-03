import { describe, it, expect, vi, beforeEach } from "vitest";
import { SpeechSynthesisUtteranceRemote } from "../../src/tts/SpeechSynthesisModule";
import { UtteranceCharge } from "../../src/billing/BillingModule";
import { StreamedSpeech } from "../../src/tts/SpeechModel";
import {
  SpeechHistoryModule,
  SpeechRecord,
} from "../../src/tts/SpeechHistoryModule";

describe("SpeechHistoryModule", () => {
  let speechHistoryModule: SpeechHistoryModule;

  beforeEach(() => {
    speechHistoryModule = SpeechHistoryModule.getInstance();
  });

  describe("mergeSpeechRecords", () => {
    it("should merge speech records when utterance IDs match", () => {
      const record = new SpeechRecord(
        {
          id: "utterance1",
          text: "hello world!",
        } as SpeechSynthesisUtteranceRemote,
        { cost: 50, utteranceId: "utterance1" } as UtteranceCharge
      );
      const speech = {
        utterance: { id: "utterance1" } as SpeechSynthesisUtteranceRemote,
        charge: { cost: 30, utteranceId: "utterance1" } as UtteranceCharge,
      } as StreamedSpeech;

      const mergedRecord = (speechHistoryModule as any).mergeSpeechRecords(
        record,
        speech
      );

      expect(mergedRecord.utterance.id).toBe("utterance1");
      expect(mergedRecord.utterance.text).toBe("hello world!");
      expect(mergedRecord.charge).toEqual({
        cost: 30,
        utteranceId: "utterance1",
      });
    });

    it("should not merge speech records when utterance IDs do not match", () => {
      const record = new SpeechRecord(
        { id: "utterance1" } as SpeechSynthesisUtteranceRemote,
        { cost: 50, utteranceId: "utterance1" } as UtteranceCharge
      );
      const speech = {
        utterance: { id: "utterance2" } as SpeechSynthesisUtteranceRemote,
        charge: { cost: 30, utteranceId: "utterance2" } as UtteranceCharge,
      } as StreamedSpeech;

      const consoleWarnSpy = vi
        .spyOn(console, "warn")
        .mockImplementation(() => {});

      const mergedRecord = (speechHistoryModule as any).mergeSpeechRecords(
        record,
        speech
      );

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "Speech records are incompatible for merging."
      );
      expect(mergedRecord).toBe(record);

      consoleWarnSpy.mockRestore();
    });
  });
});
