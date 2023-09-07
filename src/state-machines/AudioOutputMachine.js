import { createMachine, assign, raise } from "xstate";
import { isSafari, isMobileView } from "../UserAgentModule";

const EventBus = window.EventBus;
// hacky way to export the factory function
window.createAudioOutputMachine = (initialContext) => {
  return createMachine(
    {
      /** @xstate-layout N4IgpgJg5mDOIC5QEMCuECWB7A8qgLgA4EB0GEANmAMQVbIQDK+yATvgNoAMAuoqISywM+bADt+IAB6IAjACYArCQAsATg0AOAGwBmAOxdDXebIA0IAJ6IV2lSU2KuXRSpX7FuzWoC+Pi2iYuATE+CR0DBhiUNSEFMiW3HxIIILColgSKTIIKvJqJPqyXGq2urLadopq2hbWuXYOTi5uHl6+-iCB2HhEpBGY0bFosGBJkmki4pI5eQVFJWUVVTV1iPr62iTazlwqst5qihvafgHoPSH99IMxsPhYhOMpkxlZoLP5hcWlessq1VqVkQSlkJCUzkUBz22jUzl0Zy6F2CfTCcQSURihBGY14EyEU0yM3WxRIcO08lhbk0mxUmjWuX0uhIuxcujUTL02k0iO6KNCJHRlkx1Huj2eAgJb2JCAWZK4FKpdNp9OBCAM8hZu0U8nkXncpV5yN6AqFIrAYggkAlqSl02yJK48sVpWVdlV9TymuabOKO0UmlkRqCJtI2NQowgsXiiTxLztRIdCC020UFNKHk0Gt0DM89kczm0smqak0ZdOnT5obROKjYqeccl6XtHzk8kMTVK7OVWcUDI8YIBzgBWZq7I65xDVxrEcg1FYYAGNteLekjudlNdNPduccJF0zQptn0x4RleN05I9cIc4GzDYnEbtubidbCAUHccXdKNN7DMDJA+kWaYHHCaZ+J0YhYFa8ApFW074i+7xrggAC0QL1OhWqsjhkLBpcqJkJQYCIYSyGfAytjKAekKtJ43j4fy1yRNEpHSkmSjKB4+iBkoBiBmUlH7E0hayO41TKox1aCjGmJsauOSeFsRzlAelQaLoB6UfImgiS4J6yPoajsnYUmXuGkbya+KGyLZYLkjpzS2fo8j9jpqjNDqmgqFwsgaIoZmEdekBWeRcjaEZnbqJSAInAy2iKFxWYGIY8i2FmEE+EAA */
      id: "audioOutput",
      context: initialContext,
      initial: "idle",
      states: {
        idle: {
          on: {
            loadStart: "loading",
          },
        },
        loading: {
          on: {
            play: "playing",
            pause: "paused",
            stop: "stopped",
          },
          entry: {
            type: "emitEvent",
            params: { eventName: "saypi:ready" },
          },
        },
        playing: {
          on: {
            pause: "paused",
            stop: "stopped",
            ended: "stopped",
          },
          entry: [
            { type: "autoPauseSafari" },
            {
              type: "emitEvent",
              params: { eventName: "saypi:piSpeaking" },
            },
          ],
        },
        paused: {
          on: {
            play: "playing",
            stop: "stopped",
            reload: {
              target: "loading",

              description: `Reload the audio stream for Safari.
This is the only command that external modules can send the machine.`,

              action: assign((context, event) => {
                context.audioElement.load();
                context.audioElement.play();
                return {
                  userStarted: true,
                  audioElement: context.audioElement,
                };
              }),

              cond: "isSafariMobile",
            },
          },
          entry: {
            type: "emitEvent",
            params: { eventName: "saypi:pause" },
          },
        },
        stopped: {
          on: {
            loadStart: {
              target: "loading",
              description: `Fired when the audio element's src attribute changes with a new response track.`,
            },
          },
          entry: [
            {
              type: "emitEvent",
              params: { eventName: "saypi:piStoppedSpeaking" },
            },
            assign((context, event) => {
              return { userStarted: false, audioElement: context.audioElement };
            }),
            "seekToEnd",
          ],
        },
      },
      predictableActionArguments: true,
      preserveActionOrder: true,
    },
    {
      actions: {
        emitEvent: (context, event, { action }) => {
          EventBus.emit(action.params.eventName);
        },
        autoPauseSafari: (context, event) => {
          if (!isSafari() || !isMobileView()) {
            return;
          }

          if (!context.userStarted) {
            raise("pause"); // raise and send are available in xstate but not in @xstate/fsm
            //context.audioElement.pause();
          }
        },
        seekToEnd: (context, event) => {
          const audio = context.audioElement;
          if (
            audio.duration &&
            !audio.ended &&
            audio.currentTime < audio.duration
          ) {
            audio.currentTime = audio.duration; // seek the audio to the end
            audio.play(); // trigger the ended event
          }
        },
      },
      guards: {
        isSafariMobile: (context, event) => {
          return isSafari() && isMobileView();
        },
      },
    }
  );
};
