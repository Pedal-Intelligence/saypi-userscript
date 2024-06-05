import { describe, it, expect, vi, beforeEach } from "vitest";
import { SpeechSynthesisUtteranceRemote } from "../../src/tts/SpeechSynthesisModule";
import { UtteranceCharge } from "../../src/billing/BillingModule";
import { StreamedSpeech } from "../../src/tts/SpeechModel";
import {
  SpeechHistoryModule,
  SpeechRecord,
} from "../../src/tts/SpeechHistoryModule";
import { md5 } from "js-md5";

describe("SpeechHistoryModule", () => {
  let speechHistory: SpeechHistoryModule;

  beforeEach(() => {
    speechHistory = SpeechHistoryModule.getInstance();
  });

  describe("SpeechHistoryStorageMocks", () => {
    it("should get storage data", async () => {
      global.chrome.storage.local.set({ testKey: "testValue" }, () => {});
      const data = await speechHistory.getStorageData("testKey");
      expect(data).toBe("testValue");
    });

    it("should set storage data", async () => {
      await speechHistory.setStorageData({ testKey: "newValue" });
      global.chrome.storage.local.get(["testKey"], (result) => {
        expect(result.testKey).toBe("newValue");
      });
    });
  });

  describe("addSpeechToHistory", () => {
    it("should create a new speech record if it does not exist", async () => {
      const theContent = "hello world!";
      const theUtterance = {
        id: "utterance1",
        text: theContent,
      } as SpeechSynthesisUtteranceRemote;
      const theHash = md5(theContent);
      const speech = {
        utterance: theUtterance,
      } as StreamedSpeech;

      const createdRecord = await speechHistory.addSpeechToHistory(
        theHash,
        speech
      );

      expect(createdRecord).toEqual(new SpeechRecord(theHash, theUtterance));
      const retrievedRecord = await speechHistory.getSpeechFromHistory(theHash);
      expect(retrievedRecord).toEqual(createdRecord);
    });

    it("should update an existing speech record if it exists", async () => {
      const theContent = "hello world!";
      const theUtterance = {
        id: "utterance1",
        text: theContent,
      } as SpeechSynthesisUtteranceRemote;
      const theHash = md5(theContent);
      const initialSpeech = new SpeechRecord(theHash, theUtterance);

      // intially save speech without charge
      const createdRecord = await speechHistory.addSpeechToHistory(
        theHash,
        initialSpeech
      );
      expect(createdRecord).toEqual(initialSpeech);
      const retrievedRecord = await speechHistory.getSpeechFromHistory(theHash);
      expect(retrievedRecord).toEqual(createdRecord);

      // later update speech with charge
      const theCharge = new UtteranceCharge(theUtterance, 50);
      const chargedSpeech = new SpeechRecord(theHash, theUtterance, theCharge);
      const updatedRecord = await speechHistory.addSpeechToHistory(
        theHash,
        chargedSpeech
      );
      expect(updatedRecord).toEqual(chargedSpeech);
      const retrievedUpdatedRecord = await speechHistory.getSpeechFromHistory(
        theHash
      );
      expect(retrievedUpdatedRecord).toEqual(updatedRecord);
    });
  });

  describe("addChargeToHistory", () => {
    it("should create a new speech record with the charge if it does not exist", async () => {
      const theContent = "hello world!";
      const theUtterance = {
        id: "utterance1",
        text: theContent,
      } as SpeechSynthesisUtteranceRemote;
      const theHash = md5(theContent);
      const theCharge = {
        cost: 50,
        utteranceId: theUtterance.id,
        utteranceHash: theHash,
      } as UtteranceCharge;
      await speechHistory.addChargeToHistory(theHash, theCharge);

      await speechHistory.addSpeechToHistory(
        theHash,
        new SpeechRecord(theHash, theUtterance)
      );
      const retrievedRecord = await speechHistory.getSpeechFromHistory(theHash);
      expect(retrievedRecord).toEqual(
        new SpeechRecord(theHash, theUtterance, theCharge)
      );
    });

    it("should update the charge of an existing speech record", async () => {
      const theContent = "hello world!";
      const theUtterance = {
        id: "utterance1",
        text: theContent,
      } as SpeechSynthesisUtteranceRemote;
      const theHash = md5(theContent);
      const existingRecord = new SpeechRecord(theHash, theUtterance);
      await speechHistory.addSpeechToHistory(theHash, existingRecord); // add speech first

      const theCharge = new UtteranceCharge(theUtterance, 50);
      await speechHistory.addChargeToHistory(theHash, theCharge); // then add charge

      // Check that the charge was added to the existing record
      const combinedRecord = await speechHistory.getSpeechFromHistory(theHash);
      expect(combinedRecord).toEqual(
        new SpeechRecord(theHash, theUtterance, theCharge)
      );
    });
  });
});
