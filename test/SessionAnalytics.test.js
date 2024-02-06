import { interpret } from "xstate";
import { createModel } from "@xstate/test";
import { machine as sessionAnalyticsMachine } from "../src/state-machines/SessionAnalyticsMachine";

const testMachine = sessionAnalyticsMachine.withConfig({
  actions: {
    notifyEndSession: () => {},
    notifySendMessage: () => {},
    notifyStartSession: () => {},
  },
});

const sessionAnalyticsModel = createModel(testMachine).withEvents({
  start_session: {},
  transcribing: {
    audio_duration_seconds: 10,
    speech_start_time: Date.now() - 10000,
    speech_end_time: Date.now(),
  },
  send_message: { delay_ms: 5000 },
  end_session: {},
});

describe("session analytics machine", () => {
  const testPlans = sessionAnalyticsModel.getSimplePathPlans();

  testPlans.forEach((plan) => {
    describe(plan.description, () => {
      plan.paths.forEach((path) => {
        it(path.description, async () => {
          const service = interpret(testMachine)
            .onTransition((current) => {
              // you can add additional assertions here
            })
            .start();

          await path.test(service);
          service.stop();
        });
      });
    });
  });

  it("should have full coverage", () => {
    return sessionAnalyticsModel.testCoverage();
  });
});
