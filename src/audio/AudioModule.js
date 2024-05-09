// import state machines for audio input and output
import { interpret } from "xstate";
import { audioInputMachine } from "../state-machines/AudioInputMachine.ts";
import { audioOutputMachine } from "../state-machines/AudioOutputMachine.ts";
import { machine as audioRetryMachine } from "../state-machines/AudioRetryMachine.ts";
import { logger, serializeStateValue } from "../LoggingModule.js";
import EventBus from "../events/EventBus.js";
import { isSafari } from "../UserAgentModule.js";

export default class AudioModule {
  constructor() {
    if (AudioModule.instance) {
      return AudioModule.instance;
    }

    this.audioElement = document.querySelector("audio");
    if (!this.audioElement) {
      console.error("Audio element not found!");
    } else {
      this.audioElement.id = "saypi-audio-main";
      console.debug("Audio element found", this.audioElement);
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

    // Safari audio error handling logic (known issue in at least Safari <= 17.4)
    if (isSafari()) {
      this.audioRetryActor = interpret(audioRetryMachine);
      this.audioRetryActor.onTransition((state) => {
        if (state.changed) {
          const fromState = state.history
            ? serializeStateValue(state.history.value)
            : "N/A";
          const toState = serializeStateValue(state.value);
          logger.debug(
            `Audio Retry Machine transitioned from ${fromState} to ${toState} with ${state.event.type}`
          );
        }
      });
    }

    AudioModule.instance = this;
  }

  static getInstance() {
    if (!AudioModule.instance) {
      AudioModule.instance = new AudioModule();
    }

    return AudioModule.instance;
  }

  start() {
    // audio output (Pi)
    this.audioOutputActor.start();
    this.registerAudioPlaybackEvents(this.audioElement, this.audioOutputActor);
    //this.safariErrorHandler.startMonitoring();
    this.registerLifecycleDebug();

    // audio input (user)
    this.audioInputActor.start();
    this.registerAudioCommands(this.audioInputActor, this.audioOutputActor);

    if (isSafari()) {
      // audio retry
      console.log("Using audio retry handler for Safari.");
      this.audioRetryActor.start();
      this.registerAudioPlaybackEvents(this.audioElement, this.audioRetryActor);
      this.registerSourceChangeEvents(this.audioElement, this.audioRetryActor);
    }
  }

  stop() {}

  /**
   *
   * @param {HTMLAudioElement} audio
   * @param {audioOutputMachine} actor
   */
  registerAudioPlaybackEvents(audio, actor) {
    const events = [
      "loadedmetadata",
      "canplaythrough",
      "play",
      "pause",
      "ended",
      "seeked",
      "emptied",
    ];

    const sourcedEvents = ["loadstart"];
    sourcedEvents.forEach((event) => {
      audio.addEventListener(event, (e) => {
        const detail = { source: audio.currentSrc };
        actor.send(event, detail);
      });
    });

    events.forEach((event) => {
      audio.addEventListener(event, () => actor.send(event));
    });

    audio.addEventListener("playing", () => {
      actor.send("play");
    });
  }

  registerSourceChangeEvents(audio, actor) {
    this.lastSource = audio.src;
    audio.addEventListener("loadstart", () => {
      if (audio.currentSrc !== this.lastSource) {
        actor.send("sourceChanged");
        this.lastSource = audio.currentSrc;
      }
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
    EventBus.on("audio:input:reconnect", function (e) {
      inputActor.send("release");
      inputActor.send(["acquire", "start"]);
    });

    // audio output (playback) commands
    EventBus.on("audio:changeProvider", (detail) => {
      outputActor.send({ type: "changeProvider", ...detail });
    });
    EventBus.on("audio:skipNext", (e) => {
      outputActor.send("skipNext");
    });
    EventBus.on("audio:skipCurrent", (e) => {
      // Pause the audio
      this.audioElement.pause();

      // Skip to the end to simulate the completion of the audio, preventing it from being resumed
      if (!isNaN(this.audioElement.duration)) {
        this.audioElement.currentTime = this.audioElement.duration;
      }
    });
    EventBus.on("audio:output:play", (e) => {
      this.audioElement.play();
    });
    EventBus.on("audio:output:pause", (e) => {
      this.audioElement.pause();
    });
    EventBus.on("audio:output:resume", (e) => {
      this.audioElement.play();
    });
    EventBus.on(
      "audio:load",
      (detail) => {
        this.loadAudio(detail.url);
      },
      this
    );
    EventBus.on("audio:reload", (e) => {
      this.audioElement.load();
    });
  }

  /**
   * Load an audio file into the main audio element,
   * replacing the current audio source, i.e. Pi's speech.
   *
   * To invoke this function with loose coupling to the audio module,
   * raise a "audio:load" event with the URL of the audio file to load.
   * @param {string} url
   */
  loadAudio(url, play = true) {
    if (url) {
      this.audioElement.src = url;
      if (play) {
        this.audioElement
          .play()
          .then(() => {
            console.log(`Playing audio from ${this.audioElement.currentSrc}`);
          })
          .catch((error) => {
            console.error(
              `Error playing audio from ${this.audioElement.currentSrc}`,
              error
            );
          });
      } else {
        this.audioElement
          .load()
          .then(() => {
            console.log(`Loaded audio from ${this.audioElement.currentSrc}`);
          })
          .catch((error) => {
            console.error(
              `Error loading audio from ${this.audioElement.currentSrc}`,
              error
            );
          });
      }
    }
  }

  registerLifecycleDebug() {
    let starttime;
    this.audioElement.onerror = (event) => {
      console.error(
        `Error playing audio from ${this.audioElement.currentSrc}`,
        event
      );
    };

    this.audioElement.onloadstart = () => {
      console.log(`Loading audio from ${this.audioElement.currentSrc}`);
      starttime = Date.now();
    };

    // Handle successful loading and playing of the audio
    this.audioElement.onloadeddata = () => {
      const endtime = Date.now();
      const elapsedtime = (endtime - starttime) / 1000;
      console.log(
        `Audio is loaded after ${elapsedtime}s from ${this.audioElement.currentSrc}`
      );
    };

    this.audioElement.oncanplay = () => {
      const endtime = Date.now();
      const elapsedtime = (endtime - starttime) / 1000;
      console.log(
        `Audio is ready to play after ${elapsedtime}s from ${this.audioElement.currentSrc}`
      );
    };

    this.audioElement.oncanplaythrough = () => {
      const endtime = Date.now();
      const elapsedtime = (endtime - starttime) / 1000;
      console.log(
        `Audio is ready to play through after ${elapsedtime}s from ${this.audioElement.currentSrc}`
      );
    };

    // Handle audio playback completion
    this.audioElement.onended = () => {
      const endtime = Date.now();
      const elapsedtime = (endtime - starttime) / 1000;
      console.log(`Audio playback ended after ${elapsedtime}s`);
    };
  }
}
