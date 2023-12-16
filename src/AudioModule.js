// import state machines for audio input and output
import { interpret } from "xstate";
import { audioInputMachine } from "./state-machines/AudioInputMachine.ts";
import { audioOutputMachine } from "./state-machines/AudioOutputMachine.js";
import { logger, serializeStateValue } from "./LoggingModule.js";
import EventBus from "./EventBus.js";

export default class AudioModule {
  constructor() {
    this.audioElement = document.querySelector("audio");
    if (!this.audioElement) {
      console.error("Audio element not found!");
    } else {
      this.audioElement.preload = "auto"; // enable aggressive preloading of audio
    }

    this.audioOutputActor = interpret(audioOutputMachine);
    this.audioOutputActor.onTransition((state) => {
      if (state.changed) {
        const fromState = state.history
          ? serializeStateValue(state.history.value)
          : "N/A";
        const toState = serializeStateValue(state.value);
        logger.debug(
          `Audio Output Machine transitioned from ${fromState} to ${toState} with ${state.event.type}`
        );
      }
    });

    this.audioInputActor = interpret(audioInputMachine);
    this.audioInputActor.onTransition((state) => {
      if (state.changed) {
        const fromState = state.history
          ? serializeStateValue(state.history.value)
          : "N/A";
        const toState = serializeStateValue(state.value);
        logger.debug(
          `Audio Input Machine transitioned from ${fromState} to ${toState} with ${state.event.type}`
        );
      }
    });
  }

  start() {
    // audio output (Pi)
    this.audioOutputActor.start();
    this.registerAudioPlaybackEvents(this.audioElement, this.audioOutputActor);

    // audio input (user)
    this.audioInputActor.start();
    this.registerAudioCommands(this.audioInputActor, this.audioOutputActor);
  }

  registerAudioPlaybackEvents(audio, actor) {
    const events = [
      "loadstart",
      "loadedmetadata",
      "canplaythrough",
      "play",
      "pause",
      "ended",
      "seeked",
      "emptied",
    ];

    events.forEach((event) => {
      audio.addEventListener(event, () => actor.send(event));
    });

    audio.addEventListener("playing", () => {
      actor.send("play");
    });
  }

  /* These events are used to control/pass requests to the audio module from other modules */
  registerAudioCommands(inputActor, outputActor) {
    // audio input (recording) commands
    EventBus.on("audio:setupRecording", function (e) {
      inputActor.send("acquire");
    });

    EventBus.on("audio:tearDownRecording", function (e) {
            inputActor.send("release");
    });

    EventBus.on("audio:startRecording", function (e) {
      // Check if Pi is currently speaking and stop her audio
      outputActor.send("pause");

      // Check if the microphone is acquired before starting?
      inputActor.send(["acquire", "start"]);
    });
    EventBus.on("audio:stopRecording", function (e) {
      inputActor.send("stopRequested");
      /* resume or cancel Pi's audio */
      /* TODO: reassess how to handle interruptions
      outputActor.send("play"); // resume Pi's audio
      outputActor.send("stop"); // cancel Pi's audio
      */
    });
    // audio input (recording) events (pass media recorder events -> audio input machine actor)
    EventBus.on("audio:dataavailable", (detail) => {
      inputActor.send({ type: "dataAvailable", ...detail });
    });
    EventBus.on("audio:input:stop", function (e) {
      inputActor.send("stop");
    });

    // audio output (playback) commands
    EventBus.on("audio:reload", function (e) {
      outputActor.send("reload");
    });
    EventBus.on("audio:skipNext", function (e) {
      outputActor.send("skipNext");
    });
    EventBus.on("audio:skipCurrent", (e) => {
      this.audioElement.pause();
    });
  }
}
