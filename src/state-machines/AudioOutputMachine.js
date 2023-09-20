import { createMachine, assign } from "xstate";
import { isSafari } from "../UserAgentModule";

const EventBus = window.EventBus;

const audioElement = document.querySelector("audio");
if (!audioElement) {
  console.error("Audio element not found in output machine!");
}

export const audioOutputMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QEMCuECWB7A8qgLgA4EDEYAtofhpANoAMAuoqIVrBtVgHYsgCeiALQBGAOwBWADQgAHohEBOACzKAdMrEA2LQA4ATPq0iJW-QF9zMtJlwFi+NRggAbMCRdZkEWPmQAnfAZmJBA2Di5eUPkEQwk1aQFERX1FNXoM+hMAZnoJXRFsrUtrdGw8IgI1T28MbigPLwhIcjA-CGQ-YL5wzmwo0BiJfRlBBAKEzPpFDPFdbP1lEpAbcvsqmuaINX8wb34SQhdkfm7Q3si+GJEsrQTsmbNEsdTsybEDD7yCouXVu0qjk2kDURxOdQahDQsDAZ1Y7D6PCuySM90UIn0GKMym+o0Qqn0ai0C0+um+hWKVhWZQBDmqTRBYP4ELI3C2cLCCMu0RRdwkDwxWK0OPyeIQ4noan0Eg++i++UK+T+NIqdOB2yZLIAxshuEz8AALfxYVBQA0ci79ZEIRQytRibTTehaPLZbLzMXDMT23QzB1khW-Kn-VUbBka47M+okC1cq08m2o-nozGGYW4pIIB53Yn6UnkoOlWyhoHh0HQyCHSOxiLxwYKLLqIpiRZmbEZsbZZS6NSFPNygM-SlFtaA+neRkViAkXabGuIgZyBR5ntiG6KRRt9OizPKW32iSzfkFiTK4vrUsT7ZgNmVmFgADWdCYPTjSITpj5Yno2Qxz0QRSEn2-r0GIyjiOIlhUtwWDNPAoQhher61u+9YIEIWhikIRiEqewYqheTiuGAyELtaygjJm2hvKkIh6EoLbdj+Z6jmqTQQqR3JoXRvr2iINwykYJhmGKvGHkeHyHroujKHhI60mGV6cXWS6xBIaTJs60qiYSkhfHu+hFO6igsQpl5bDsewQGM8IoYuMQUeomlPGK+hZESCwgWBEFiKZJbjhZmr1MpqGqVoiirqoMnOq67rZGKCzqH2+aBsO1LnmO6rlqgMIQCF9kKAJRLiK2aYiroCXge8KVDn5hFZTeWz5dauTes52mZhIdq5jVFJQeYQA */
    id: "audioOutput",
    context: { autoplay: false, audioElement: audioElement },
    initial: "idle",

    states: {
      idle: {
        on: {
          loadstart: "loading",
        },
      },

      loading: {
        on: {
          loadedmetadata: "loaded",
        },
      },

      loaded: {
        initial: "ready",

        on: {
          emptied: "idle",
        },

        states: {
          ready: {
            description: `Audio has loaded and is ready to start playing (further buffering may be required to reach the end).`,
            on: {
              play: "playing",
            },
            entry: {
              type: "emitEvent",
              params: { eventName: "saypi:ready" },
            },
          },

          playing: {
            on: {
              pause: "paused",
              ended: "ended",
              canplaythrough: { target: "playing", internal: true },
            },
            always: {
              target: "paused",
              cond: "isSafariAutoPlay",
              actions: [
                "requestPause",
                {
                  type: "emitEvent",
                  params: { eventName: "saypi:safariBlocked" },
                },
              ],
            },
            entry: [
              {
                type: "emitEvent",
                params: { eventName: "saypi:piSpeaking" },
              },
            ],
            exit: [
              {
                type: "emitEvent",
                params: { eventName: "saypi:piStoppedSpeaking" },
              },
              assign({
                autoplay: true,
                audioElement: (context) => context.audioElement,
              }),
            ],
          },

          paused: {
            on: {
              play: "playing",
              reload: {
                target: "#audioOutput.loading",
                description: `Reload the audio stream for Safari. This is the only command that external modules can send the machine.`,
                actions: [
                  assign((context) => {
                    return {
                      autoplay: false,
                      audioElement: context.audioElement,
                    };
                  }),
                  "requestReload",
                ],
                cond: "isSafari",
              },
            },
          },

          ended: {
            on: {
              seeked: {
                target: "#audioOutput.loaded.ready",
                description: `An ended track is seeked back to earlier in the track.`,
              },
            },
            entry: [
              {
                type: "emitEvent",
                params: { eventName: "saypi:piFinishedSpeaking" },
              },
            ],
          },
        },
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
      requestPause: (context, event) => {
        context.audioElement.pause();
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
        EventBus.emit("saypi:piFinishedSpeaking");
      },
      requestReload: (context) => {
        const audio = context.audioElement;
        audio.load();
        // may want to consider waiting on the loadedmetadata event
        // and then calling audio.play() with a catch for any errors
        audio.play();
      },
    },
    guards: {
      isSafari: (context, event) => {
        return isSafari();
      },
      isSafariAutoPlay: (context, event) => {
        return isSafari() && context.autoplay;
      },
    },
  }
);
