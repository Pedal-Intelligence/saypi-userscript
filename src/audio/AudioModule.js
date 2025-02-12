// import state machines for audio input and output
import { interpret } from "xstate";
import { audioInputMachine } from "../state-machines/AudioInputMachine.ts";
import { audioOutputMachine } from "../state-machines/AudioOutputMachine.ts";
import { voiceConverterMachine } from "../state-machines/VoiceConverter.ts";
import { machine as audioRetryMachine } from "../state-machines/AudioRetryMachine.ts";
import { logger, serializeStateValue } from "../LoggingModule.js";
import EventBus from "../events/EventBus.js";
import { isSafari } from "../UserAgentModule.ts";
import SlowResponseHandler from "../SlowResponseHandler.ts";
import { CacheBuster } from "../CacheBuster.ts";
import { UserPreferenceModule } from "../prefs/PreferenceModule.ts";

export default class AudioModule {
  constructor() {
    if (AudioModule.instance) {
      return AudioModule.instance;
    }

    this.AUDIO_ELEMENT_ID = "saypi-audio-main";
    this.audioElement = null;
    this.mutationObserver = null;
    this.swapObserver = null;

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

    this.voiceConverter = interpret(voiceConverterMachine);
    this.voiceConverter.onTransition((state) => {
      if (state.changed) {
        const fromState = state.history
          ? serializeStateValue(state.history.value)
          : "N/A";
        const toState = serializeStateValue(state.value);
        logger.debug(
          `Voice Converter Machine transitioned from ${fromState} to ${toState} with ${state.event.type}`
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

    this.registerOfflineAudioCommands();

    AudioModule.instance = this;
  }

  static getInstance() {
    if (!AudioModule.instance) {
      AudioModule.instance = new AudioModule();
    }

    return AudioModule.instance;
  }

  start() {
    this.findAndDecorateAudioElement(); // need to ensure an audio element exists before registering event listeners
    // audio output (Pi)
    this.audioOutputActor.start();
    this.registerAudioPlaybackEvents(this.audioElement, this.audioOutputActor);
    // convert voice for Pi's missing voices - since 2024-09
    this.registerAudioPlaybackEvents(this.audioElement, this.voiceConverter);
    // handle slow responses from pi.ai - since 2024-07
    const slowResponseHandler = SlowResponseHandler.getInstance();
    this.registerAudioErrorEvents(this.audioElement, slowResponseHandler);
    this.registerLifecycleDebug();

    // audio input (user)
    this.audioInputActor.start();
    this.registerAudioCommands(
      this.audioInputActor,
      this.audioOutputActor,
      this.voiceConverter
    );

    // voice converter
    this.voiceConverter.start();
    this.initializeVoiceConverter();

    if (isSafari()) {
      // audio retry
      console.log("Using audio retry handler for Safari.");
      this.audioRetryActor.start();
      this.registerAudioPlaybackEvents(this.audioElement, this.audioRetryActor);
      this.registerSourceChangeEvents(this.audioElement, this.audioRetryActor);
      this.registerAudioErrorEvents(this.audioElement, this.audioRetryActor);
    }

    this.listenForAudioElementSwap();
  }

  stop() {}

  initializeVoiceConverter() {
    const prefs = UserPreferenceModule.getInstance();
    prefs.getVoice().then((voice) => {
      if (voice) {
        console.log("Preferred voice is", voice);
        this.voiceConverter.send({ type: "changeVoice", voice });
      } else {
        console.log("Default voice is preferred");
      }
    });
  }

  findAudioElement(searchRoot) {
    let audioElement = searchRoot.querySelector(`#${this.AUDIO_ELEMENT_ID}`);
    if (!audioElement) {
      audioElement = searchRoot.querySelector("audio");
    }
    return audioElement;
  }

  decorateAudioElement(audioElement) {
    if (audioElement) {
      audioElement.id = this.AUDIO_ELEMENT_ID;
    }
  }

  findAndDecorateAudioElement(searchRoot = document) {
    this.audioElement = this.findAudioElement(searchRoot);
    if (!this.audioElement) {
      // an audio element is required for audio input/output, so create one if it doesn't exist
      this.audioElement = new Audio();
      document.body.appendChild(this.audioElement); // <- this happens too soon for pi.ai, before it loads its own audio element
    }
    this.decorateAudioElement(this.audioElement);
    this.registerRemovalListener();
  }

  swapAudioElement(newAudioElement) {
    if (this.audioElement) {
      this.cleanupAudioElement(this.audioElement);
    }

    this.audioElement = newAudioElement;
    this.decorateAudioElement(this.audioElement);
    this.registerAudioPlaybackEvents(this.audioElement, this.audioOutputActor);
    this.registerAudioPlaybackEvents(this.audioElement, this.voiceConverter);
    const slowResponseHandler = SlowResponseHandler.getInstance();
    this.registerAudioErrorEvents(this.audioElement, slowResponseHandler);
    if (isSafari()) {
      this.registerAudioPlaybackEvents(this.audioElement, this.audioRetryActor);
      this.registerSourceChangeEvents(this.audioElement, this.audioRetryActor);
    }
    this.registerRemovalListener();
    this.registerLifecycleDebug();
  }

  registerRemovalListener() {
    if (this.audioElement) {
      const config = { childList: true, subtree: false };

      this.mutationObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === "childList") {
            for (const removedNode of mutation.removedNodes) {
              const removedAudioElement = this.findAudioElement(removedNode);
              if (removedAudioElement === this.audioElement) {
                console.debug("Audio element removed from the document");
                this.cleanupAudioElement(this.audioElement);
                this.audioElement = null;
                this.listenForAudioElementSwap();
                return;
              }
            }
          }
        }
      });

      // Use optional chaining and nullish coalescing for safer access
      const observeTarget = this.audioElement.parentNode ?? document.body;
      this.mutationObserver.observe(observeTarget, config);
    }
  }

  cleanupAudioElement(audioElement) {
    // Deregister all event listeners
    const events = [
      "loadedmetadata",
      "canplaythrough",
      "play",
      "pause",
      "ended",
      "seeked",
      "emptied",
      "playing",
      "loadstart",
      "error",
      "loadeddata",
      "canplay",
      "canplaythrough",
    ];

    events.forEach((event) => {
      audioElement.removeEventListener(event, this[`on${event}`]);
    });

    // Remove source change listener if it exists
    audioElement.removeEventListener("loadstart", this.onSourceChange);

    // Stop any ongoing playback
    audioElement.pause();
    audioElement.currentTime = 0;

    // Remove src attribute
    audioElement.removeAttribute("src");

    // Empty the source elements if any
    while (audioElement.firstChild) {
      audioElement.removeChild(audioElement.firstChild);
    }

    // Nullify references in the AudioModule
    this.lastSource = null;

    console.debug("Cleaned up audio element");
  }

  listenForAudioElementSwap() {
    if (this.swapObserver) {
      this.swapObserver.disconnect();
    }

    const config = { childList: true, subtree: true };

    this.swapObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          for (const addedNode of mutation.addedNodes) {
            if (addedNode.nodeType === Node.ELEMENT_NODE) {
              const newAudioElement = this.findAudioElement(addedNode);
              if (newAudioElement && newAudioElement !== this.audioElement) {
                console.debug("New audio element found", newAudioElement);
                this.swapAudioElement(newAudioElement);
                // Don't disconnect the observer, keep listening for future swaps
                return;
              }
            }
          }
        }
      }
    });

    this.swapObserver.observe(document.body, config);
  }

  /**
   *
   * @param {HTMLAudioElement} audio
   * @param {some interpreted state machine} actor
   */
  registerAudioPlaybackEvents(audio, actor) {
    const events = [
      "loadedmetadata",
      "canplaythrough",
      "pause",
      "ended",
      "seeked",
      "emptied",
    ];

    const sourcedEvents = ["loadstart", "play", "error"];
    sourcedEvents.forEach((event) => {
      audio.addEventListener(event, (e) => {
        const detail = { source: audio.currentSrc };
        actor.send(event, detail);
      });
    });

    events.forEach((event) => {
      audio.addEventListener(event, () => {
        actor.send(event);
      });
    });

    audio.addEventListener("playing", () => {
      actor.send("play", { source: audio.currentSrc });
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

  /* These are events that can be passed to the audio module before start() is called,
   * without the state machines being running, or an audio element being found.
   * When a load event is received, a temporary audio element is created if needed, and the audio file is loaded.
   */
  registerOfflineAudioCommands() {
    // audio output (playback) commands
    EventBus.on(
      "audio:load",
      (detail) => {
        const audio = this.findAudioElement(document) || new Audio();
        this.loadAudio(audio, detail.url);
      },
      this
    );
    EventBus.on("audio:reload", (reloadAudioRequest) => {
      const audio = this.findAudioElement(document) || new Audio();
      if (reloadAudioRequest?.bypassCache) {
        const url = audio.src;
        audio.src = CacheBuster.addCacheBuster(url);
      }
      audio.load();
      if (reloadAudioRequest?.playImmediately) {
        audio.play();
      }
    });
  }

  /* These events are used to control/pass requests to the audio module from other modules */
  registerAudioCommands(inputActor, outputActor, voiceConverter) {
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
      // soft stop recording
      inputActor.send("stopRequested");
    });
    // audio input (recording) events (pass media recorder events -> audio input machine actor)
    EventBus.on("audio:dataavailable", (detail) => {
      inputActor.send({ type: "dataAvailable", ...detail });
    });
    EventBus.on("audio:input:stop", function (e) {
      // hard stop recording
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
    EventBus.on("audio:changeVoice", (detail) => {
      outputActor.send({ type: "changeVoice", ...detail });
      voiceConverter.send({ type: "changeVoice", ...detail });
    });
    EventBus.on("audio:skipNext", (e) => {
      console.debug("Skipping next audio");
      outputActor.send("skipNext");
    });
    EventBus.on("audio:skipCurrent", (e) => {
      // Pause the audio
      this.audioElement.pause();

      // Skip to the end to simulate the completion of the audio, preventing it from being resumed
      if (
        Number.isFinite(this.audioElement.duration) &&
        !isNaN(this.audioElement.duration)
      ) {
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

    EventBus.on("saypi:tts:replaying", (e) => {
      // notify the audio output machine that the next audio is a replay
      outputActor.send("replaying");
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
  loadAudio(audioElement, url, play = true) {
    if (url) {
      audioElement.src = url;
      if (play) {
        audioElement
          .play()
          .then(() => {
            console.debug(`Playing audio from ${audioElement.currentSrc}`);
          })
          .catch((error) => {
            console.error(
              `Error playing audio from ${audioElement.currentSrc}`,
              error
            );
          });
      } else {
        audioElement
          .load()
          .then(() => {
            console.debug(`Loaded audio from ${audioElement.currentSrc}`);
          })
          .catch((error) => {
            console.error(
              `Error loading audio from ${audioElement.currentSrc}`,
              error
            );
          });
      }
    }
  }

  /**
   * Register debug events on the audio element to track the audio lifecycle
   * This function is only informational, it does not handle any errors.
   */
  registerLifecycleDebug() {
    let starttime;
    this.audioElement.onerror = (event) => {
      console.error(
        `[audio lifecycle] Error playing audio from ${this.audioElement.currentSrc}`,
        event
      );
    };

    this.audioElement.onloadstart = () => {
      console.debug(`[audio lifecycle] Loading audio from ${this.audioElement.currentSrc}`);
      starttime = Date.now();
    };

    // Handle successful loading and playing of the audio
    this.audioElement.onloadeddata = () => {
      const endtime = Date.now();
      const elapsedtime = (endtime - starttime) / 1000;
      console.debug(
        `[audio lifecycle] Audio is loaded after ${elapsedtime.toFixed(1)}s from ${
          this.audioElement.currentSrc
        }`
      );
    };

    this.audioElement.oncanplay = () => {
      const endtime = Date.now();
      const elapsedtime = (endtime - starttime) / 1000;
      console.debug(
        `[audio lifecycle] Audio is ready to play after ${elapsedtime.toFixed(1)}s from ${
          this.audioElement.currentSrc
        }`
      );
    };

    this.audioElement.oncanplaythrough = () => {
      const endtime = Date.now();
      const elapsedtime = (endtime - starttime) / 1000;
      console.debug(
        `[audio lifecycle] Audio is ready to play through after ${elapsedtime.toFixed(1)}s from ${
          this.audioElement.currentSrc
        }`
      );
    };

    this.audioElement.onpause = () => {
      const endtime = Date.now();
      const elapsedtime = (endtime - starttime) / 1000;
      console.debug(`[audio lifecycle] Audio playback paused after ${elapsedtime.toFixed(1)}s`);
    };

    this.audioElement.onabort = () => {
      console.debug(`[audio lifecycle] Audio playback aborted for ${this.audioElement.currentSrc}`);
    };

    this.audioElement.onstalled = (event) => {
      const isPotentialRangeRequestFailure = 
        this.audioElement.networkState === 2 && // NETWORK_LOADING
        this.audioElement.readyState === 1 &&   // HAVE_METADATA
        this.audioElement.buffered.length === 0 &&
        this.audioElement.duration === Infinity;

      if (isPotentialRangeRequestFailure && isSafari()) {
        console.debug('[audio lifecycle] Detected potential Safari range request failure');
        // Could potentially trigger retry here instead of waiting for error
      }
      
      const networkStates = {
        0: 'NETWORK_EMPTY',
        1: 'NETWORK_IDLE',
        2: 'NETWORK_LOADING',
        3: 'NETWORK_NO_SOURCE'
      };
      
      const bufferedRanges = Array.from(this.audioElement.buffered).map(i => ({
        start: this.audioElement.buffered.start(i),
        end: this.audioElement.buffered.end(i)
      }));
      
      console.debug(
        `[audio lifecycle] Audio playback stalled for ${this.audioElement.currentSrc}`,
        {
          networkState: `${this.audioElement.networkState} (${networkStates[this.audioElement.networkState]})`,
          bufferedRanges,
          bufferedAhead: bufferedRanges.length > 0 ? 
            bufferedRanges[0].end - this.audioElement.currentTime : 
            0,
          readyState: this.audioElement.readyState,
          networkState: this.audioElement.networkState,
          error: this.audioElement.error?.code,
          errorMessage: this.audioElement.error?.message,
          timestamp: event.timeStamp,
          buffered: Array.from(this.audioElement.buffered).map(i => ({
            start: this.audioElement.buffered.start(i),
            end: this.audioElement.buffered.end(i)
          })),
          currentTime: this.audioElement.currentTime,
          duration: this.audioElement.duration
        }
      );
    };

    this.audioElement.onsuspend = () => {
      console.debug(`[audio lifecycle] Audio loading suspended for ${this.audioElement.currentSrc}`);
    };

    this.audioElement.onemptied = () => {
      console.debug(`[audio lifecycle] Audio element emptied`);
    };

    // Handle audio playback completion
    this.audioElement.onended = () => {
      const endtime = Date.now();
      const elapsedtime = (endtime - starttime) / 1000;
      console.debug(`[audio lifecycle] Audio playback ended after ${elapsedtime.toFixed(1)}s`);
    };
  }

  /**
   * Register error events on the audio element to handle slow responses from pi.ai
   * @param {HTMLAudioElement} audioElement
   * @param {SlowResponseHandler} slowResponseHandler
   */
  registerAudioErrorEvents(audio, actor) {
    // Handle explicit errors
    audio.addEventListener("error", (event) => {
      actor.send("error", { source: audio.currentSrc });
    });

    // Handle Safari range request failures
    audio.addEventListener("stalled", (event) => {
      const isPotentialRangeRequestFailure = 
        audio.networkState === 2 && // NETWORK_LOADING
        audio.readyState === 1 &&   // HAVE_METADATA
        audio.buffered.length === 0 &&
        audio.duration === Infinity;

      if (isPotentialRangeRequestFailure && isSafari()) {
        console.debug('[audio lifecycle] Detected Safari range request failure, triggering retry');
        actor.send("error", { 
          source: audio.currentSrc,
          detail: "Safari range request failure detected"
        });
      }
    });
  }
}
