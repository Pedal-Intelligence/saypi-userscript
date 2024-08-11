import { describe, it, expect, vi, beforeEach } from "vitest";
import { UtteranceCharge } from "../../src/billing/BillingModule";
import {
  PiSpeech,
  SpeechUtterance,
  StreamedSpeech,
} from "../../src/tts/SpeechModel";
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
      const theUtterance = new PiSpeech(
        "utterance1",
        "en-GB",
        PiSpeech.voice1,
        "https://pi.ai/api/chat/voice?mode=eager&voice=voice1&messageSid=utterance1"
      );

      const theHash = md5(theContent);
      const speech: StreamedSpeech = {
        utterance: theUtterance,
      };

      const createdRecord = await speechHistory.addSpeechToHistory(
        theHash,
        speech
      );

      expect(createdRecord).toEqual(new SpeechRecord(theHash, theUtterance));
      const retrievedRecord = await speechHistory.getSpeechFromHistory(theHash);
      expect(retrievedRecord).toEqual(createdRecord);
    });

    it("should update an existing speech record if it exists", async () => {
      const theContent = "hello springfield!";
      const theUtterance = new PiSpeech(
        "utterance2",
        "en-GB",
        PiSpeech.voice1,
        "https://pi.ai/api/chat/voice?mode=eager&voice=voice1&messageSid=utterance2"
      );
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
      const theCharge = new UtteranceCharge(theUtterance, 50, theHash);
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
      const theContent = "hello everyone!";
      const theUtterance = new PiSpeech(
        "utterance3",
        "en-GB",
        PiSpeech.voice1,
        "https://pi.ai/api/chat/voice?mode=eager&voice=voice1&messageSid=utterance3"
      );
      const theHash = md5(theContent);
      const theCharge = new UtteranceCharge(theUtterance, 50, theHash);
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
      const theContent = "hello my friends!";
      const theUtterance = new PiSpeech(
        "utterance4",
        "en-GB",
        PiSpeech.voice1,
        "https://pi.ai/api/chat/voice?mode=eager&voice=voice1&messageSid=utterance4"
      );
      const theHash = md5(theContent);
      const existingRecord = new SpeechRecord(theHash, theUtterance);
      await speechHistory.addSpeechToHistory(theHash, existingRecord); // add speech first

      const theCharge = new UtteranceCharge(theUtterance, 50, theHash);
      await speechHistory.addChargeToHistory(theHash, theCharge); // then add charge

      // Check that the charge was added to the existing record
      const combinedRecord = await speechHistory.getSpeechFromHistory(theHash);
      expect(combinedRecord).toEqual(
        new SpeechRecord(theHash, theUtterance, theCharge)
      );
    });
  });
});
