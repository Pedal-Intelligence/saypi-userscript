// import state machines for audio input and output
import { createActor } from "xstate";
import { audioInputMachine } from "../state-machines/AudioInputMachine.ts";
import { voiceConverterMachine } from "../state-machines/VoiceConverter.ts";
import { ChatbotIdentifier } from "../chatbots/ChatbotIdentifier.ts";
import { machine as audioRetryMachine } from "../state-machines/AudioRetryMachine.ts";
import { logger, logStateTransitions } from "../LoggingModule.js";
import EventBus from "../events/EventBus.js";
import { isSafari } from "../UserAgentModule.ts";
// SlowResponseHandler and adapter are imported dynamically for Pi.ai only
import { CacheBuster } from "../CacheBuster.ts";
import { UserPreferenceModule } from "../prefs/PreferenceModule.ts";
import { ttsVolumeForQuietMode } from "../tts/quietVolume.ts";
import { ChatbotService } from "../chatbots/ChatbotService.ts";
import OffscreenAudioBridge from "./OffscreenAudioBridge.js";
import { BrowserCompatibilityModule } from "../compat/BrowserCompatibilityModule.ts";
import { createAudioRemovalObserverCallback } from "./audioElementRemoval.ts";
import { findHostAudioElements, shouldMuteHostAudio } from "./hostAudio.ts";
import { audioProviders } from "../tts/SpeechModel.ts";
import { SpeechSynthesisModule } from "../tts/SpeechSynthesisModule.ts";
import { isVoiceSampleUrl } from "../tts/SpeechSourceParsers.ts";
import { PiNativeAudioGuard, audioSource, isPiNativeSpeechSource } from "./PiNativeAudioGuard.ts";
import { AudioSelectionSync } from "./AudioSelectionSync.ts";

const INITIAL_PLAYBACK_BUFFER_TIMEOUT_MS = 5000;

export default class AudioModule {
  constructor() {
    if (AudioModule.instance) {
      return AudioModule.instance;
    }

    this.AUDIO_ELEMENT_ID = "saypi-audio-main";
    this.audioElement = null;
    /** Are WE the voice? Reconciled from current preferences and auth. */
    this.providerIsSayPi = false;
    this.mutationObserver = null;
    this.swapObserver = null;
    
    // Initialize offscreen bridge
    this.offscreenBridge = OffscreenAudioBridge.getInstance();
    this.useOffscreenAudio = false; // Will be set in start() based on bridge.isSupported()

    // Only initialize audio output machine for chatbot sites that need TTS
    this.audioOutputActor = null;
    this.needsAudioOutput = ChatbotIdentifier.isInChatMode();

    this.pendingPlaybackController = null;
    
    if (this.needsAudioOutput) {
      // Dynamically import and initialize audio output machine only when needed
      this.audioOutputReady = this.initializeAudioOutputMachine();
    }

    this.audioInputActor = createActor(audioInputMachine);
    logStateTransitions(this.audioInputActor, "Audio Input Machine");

    this.voiceConverter = createActor(voiceConverterMachine);
    logStateTransitions(this.voiceConverter, "Voice Converter Machine");

    // Safari audio error handling logic (known issue in at least Safari <= 17.4)
    if (isSafari()) {
      this.audioRetryActor = createActor(audioRetryMachine);
      logStateTransitions(this.audioRetryActor, "Audio Retry Machine");
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

  async initializeAudioOutputMachine() {
    try {
      // Dynamically import the audio output machine only when needed
      const { audioOutputMachine } = await import(
        /* webpackMode: "eager" */ "../state-machines/AudioOutputMachine.ts"
      );
      
      this.audioOutputActor = createActor(audioOutputMachine);
      logStateTransitions(this.audioOutputActor, "Audio Output Machine");
    } catch (error) {
      logger.error("[AudioModule] Failed to initialize audio output machine:", error);
      this.needsAudioOutput = false;
    }
  }

  async start() {
    try {
      await this.audioOutputReady;
      // Initialize offscreen bridge and check if supported
      this.useOffscreenAudio = await this.offscreenBridge.isSupported();

      logger.debug(`[AudioModule] Using offscreen audio: ${this.useOffscreenAudio}`);

      // Check for TTS compatibility issues (Firefox/Safari/mobile on Claude/ChatGPT)
      // BrowserCompatibilityModule will emit events if issues detected
      // CompatibilityNotificationUI (initialized separately) will handle showing notifications
      const compatModule = BrowserCompatibilityModule.getInstance();
      compatModule.checkTTSCompatibility();

      // even if we're not using offscreen audio, set up the in-page audio element
      this.initialiseOnscreenAudio();

      this.listenForAudioElementSwap();

      if (this.useOffscreenAudio)  {
        // If we're using offscreen audio, make sure the bridge is initialized
        await this.offscreenBridge.initialize();
      }
      
      // Start all state machines
      if (this.audioOutputActor) {
        this.audioOutputActor.start();
      }
      this.audioInputActor.start();
      this.voiceConverter.start();
      if (isSafari()) {
        this.audioRetryActor.start();
      }
      
      // Register commands that will direct audio events to the appropriate target
      // (offscreen or in-page)
      this.registerAudioCommands(
        this.audioInputActor,
        this.audioOutputActor
      );
      

      // Register EventBus listeners for offscreen audio events and forward them to audio actors
      if (this.audioOutputActor) {
        this.registerOffscreenAudioEvents(this.audioOutputActor);
      }
      await this.initializeAudioSelection();
    } catch (error) {
      logger.error("[AudioModule] Error during start:", error);
      // Fallback to in-page audio if there was an error with offscreen initialization
      this.useOffscreenAudio = false;
      // Try to set up in-page audio as a fallback
      this.findAndDecorateAudioElement();
      this.registerAudioPlaybackEvents(this.audioElement, this.audioOutputActor);
      this.registerAudioPlaybackEvents(this.audioElement, this.voiceConverter);
      this.registerLifecycleDebug();
      
      // Start state machines and register commands
      if (this.audioOutputActor) {
        this.audioOutputActor.start();
      }
      this.audioInputActor.start();
      this.voiceConverter.start();
      this.registerAudioCommands(this.audioInputActor, this.audioOutputActor);
      
      // Ensure audio element swapping is monitored in fallback mode
      this.listenForAudioElementSwap();
      
      // Register EventBus listeners for offscreen audio events even in fallback mode
      // (in case we switch back to offscreen audio later)
      if (this.audioOutputActor) {
        this.registerOffscreenAudioEvents(this.audioOutputActor);
      }
      await this.initializeAudioSelection();
    }
  }

  /**
   * Initialize the in-page audio element
   * The in-page audio element is used for native audio playback, or when offscreen audio is not supported.
   */
  initialiseOnscreenAudio() {
    this.findAndDecorateAudioElement(); // need to ensure an audio element exists before registering event listeners

    // audio output (Pi) - only if we need audio output functionality
    if (this.audioOutputActor) {
      this.registerAudioPlaybackEvents(this.audioElement, this.audioOutputActor);
    }
    // convert voice for Pi's missing voices - since 2024-09
    this.registerAudioPlaybackEvents(this.audioElement, this.voiceConverter);
    
    // handle slow responses from pi.ai - since 2024-07 (Pi.ai only)
    if (ChatbotIdentifier.isChatbotType("pi")) {
      this.initializeSlowResponseHandler();
    }
    
    this.registerLifecycleDebug();

    // For Safari, register additional error handlers
    if (isSafari()) {
      // audio retry
      logger.debug("Using audio retry handler for Safari.");
      this.audioRetryActor.start();
      this.registerAudioPlaybackEvents(this.audioElement, this.audioRetryActor);
      this.registerSourceChangeEvents(this.audioElement, this.audioRetryActor);
      this.registerAudioErrorEvents(this.audioElement, this.audioRetryActor);
    }
  }

  async initializeAudioSelection() {
    if (!this.needsAudioOutput) return;
    if (!this.selectionSync) {
      const chatbot = await ChatbotService.getChatbot();
      this.selectionSync = new AudioSelectionSync({
        hostId: chatbot.getID(),
        resolve: () => SpeechSynthesisModule.getInstance().getActiveAudioSelection(chatbot),
        apply: (selection) => this.applyAudioSelection(selection),
        onError: (error) => logger.error("[AudioModule] Could not reconcile voice selection", error),
      });
    }
    await this.selectionSync.start();
  }

  applyAudioSelection({ provider, voice }) {
    this.audioOutputActor?.send({ type: "changeVoice", voice });
    this.audioOutputActor?.send({ type: "changeProvider", provider });
    this.voiceConverter.send({ type: "changeVoice", voice });
    this.providerIsSayPi = provider === audioProviders.SayPi;
    this.applyHostAudioMute();

    // Auth refreshes and other hosts' storage writes can resolve the same
    // selection again. Preserve intentional historical replays in that case.
    const previous = this.appliedSelection;
    this.appliedSelection = { provider, voice };
    if (previous?.provider === provider && (previous.voice?.id ?? null) === (voice?.id ?? null)) return;

    const offscreenSource = this.lastAudioUrl;
    if (this.useOffscreenAudio && offscreenSource && !isVoiceSampleUrl(offscreenSource) &&
        (!provider.matches(offscreenSource) || (voice && !voice.matchesSource(offscreenSource)))) {
      this.lastAudioUrl = null;
      this.offscreenBridge.stopAudio().catch((error) => {
        logger.error("[AudioModule] Could not stop the previous voice", error);
      });
    }

    // Firefox/Safari share the page player with SayPi. Muting would silence
    // our speech too, but an already-playing native source must still stop.
    const source = this.audioElement?.currentSrc || this.audioElement?.src;
    if (!this.useOffscreenAudio && source && !isVoiceSampleUrl(source) &&
        (!provider.matches(source) || (voice && !voice.matchesSource(source)))) {
      this.stopOnscreenAudio();
    }
  }

  async initializeSlowResponseHandler() {
    try {
      // Dynamically import SlowResponseHandler modules only for Pi.ai
      const [SlowResponseHandlerModule, SlowResponseHandlerAdapterModule] = await Promise.all([
        import(/* webpackMode: "eager" */ "../SlowResponseHandler.ts"),
        import(/* webpackMode: "eager" */ "./SlowResponseHandlerAdapter.js")
      ]);
      
      const SlowResponseHandler = SlowResponseHandlerModule.default;
      const { SlowResponseHandlerAdapter } = SlowResponseHandlerAdapterModule;
      
      const slowResponseHandler = SlowResponseHandler.getInstance();
      const slowResponseAdapter = new SlowResponseHandlerAdapter(slowResponseHandler);
      this.registerAudioErrorEvents(this.audioElement, slowResponseAdapter);
    } catch (error) {
      logger.error("[AudioModule] Failed to initialize slow response handler:", error);
    }
  }

  isHostAudioCandidate(audio) {
    return !ChatbotIdentifier.isChatbotType("pi") || !audioSource(audio) || isPiNativeSpeechSource(audioSource(audio));
  }

  findAudioElement(searchRoot) {
    const candidates = findHostAudioElements(searchRoot).filter(audio => audio === this.audioElement || this.isHostAudioCandidate(audio));
    return candidates.find(audio => audio.id === this.AUDIO_ELEMENT_ID) ?? candidates[0] ?? null;
  }

  decorateAudioElement(audioElement) {
    if (audioElement) {
      this.originalAudioIds ??= new WeakMap();
      if (!this.originalAudioIds.has(audioElement)) this.originalAudioIds.set(audioElement, audioElement.id);
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
    this.applyHostAudioMute();
  }

  swapAudioElement(newAudioElement) {
    if (this.audioElement) {
      this.cleanupAudioElement(this.audioElement, this.audioElement.isConnected);
    }

    this.audioElement = newAudioElement;
    this.decorateAudioElement(this.audioElement);
    if (this.audioOutputActor) {
      this.registerAudioPlaybackEvents(this.audioElement, this.audioOutputActor);
    }
    this.registerAudioPlaybackEvents(this.audioElement, this.voiceConverter);

    // handle slow responses from pi.ai - since 2024-07 (Pi.ai only)
    if (ChatbotIdentifier.isChatbotType("pi")) {
      this.initializeSlowResponseHandler();
    }
    if (isSafari()) {
      this.registerAudioPlaybackEvents(this.audioElement, this.audioRetryActor);
      this.registerSourceChangeEvents(this.audioElement, this.audioRetryActor);
    }
    this.registerRemovalListener();
    this.registerLifecycleDebug();
    // A fresh element arrives unmuted, and the host may already be playing
    // through it, so re-assert the invariant rather than waiting for a
    // loadstart we might have just missed (#602).
    this.applyHostAudioMute();
  }

  /**
   * Hold the host's audio silent while SayPi is the voice — an invariant, not a
   * reaction to a `loadstart` we have to be attached in time to see (#602).
   * Re-applied whenever the element changes or the provider does.
   */
  applyHostAudioMute() {
    if (ChatbotIdentifier.isChatbotType("pi")) {
      this.piNativeAudioGuard ??= new PiNativeAudioGuard();
      this.piNativeAudioGuard.reconcile([...document.querySelectorAll("audio")], {
        customVoice: this.providerIsSayPi, offscreen: this.useOffscreenAudio, tracked: this.audioElement,
        sharedOutput: this.isSharedPlayback(this.audioElement) ? this.audioElement : null,
      });
      return;
    }
    if (!this.audioElement) return;
    const mute = shouldMuteHostAudio({
      providerIsSayPi: this.providerIsSayPi,
      playbackIsOffscreen: this.useOffscreenAudio,
    });
    if (this.audioElement.muted !== mute) {
      logger.debug(
        `[AudioModule] ${mute ? "Muting" : "Unmuting"} the host's audio element`
      );
      this.audioElement.muted = mute;
    }
  }

  registerRemovalListener() {
    if (this.audioElement) {
      const config = { childList: true, subtree: false };

      // re-registered on every swap; don't leave the previous observer attached
      this.mutationObserver?.disconnect();

      this.mutationObserver = new MutationObserver(
        createAudioRemovalObserverCallback(
          () => this.audioElement,
          () => {
            logger.debug("Audio element removed from the document");
            this.cleanupAudioElement(this.audioElement);
            this.audioElement = null;
            this.rebindAudioElement();
          }
        )
      );

      // Use optional chaining and nullish coalescing for safer access
      const observeTarget = this.audioElement.parentNode ?? document.body;
      this.mutationObserver.observe(observeTarget, config);
    }
  }

  cleanupAudioElement(audioElement, preserveMedia = false) {
    if (!audioElement) return;
    for (const [event, listener] of this.audioPlaybackListeners?.get(audioElement) ?? []) {
      audioElement.removeEventListener(event, listener);
    }
    this.audioPlaybackListeners?.delete(audioElement);
    if (audioElement === this.audioElement) this.sharedPlaybackSource = null;
    if (audioElement.id === this.AUDIO_ELEMENT_ID && this.originalAudioIds?.has(audioElement)) {
      audioElement.id = this.originalAudioIds.get(audioElement);
      this.originalAudioIds.delete(audioElement);
    }
    // A retained host player still belongs to Pi. Detach our listeners without
    // clearing its source or pausing unrelated/native host playback.
    if (preserveMedia) return;

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

    logger.debug("Cleaned up audio element");
  }

  /**
   * Take up whatever audio element the host has NOW, and only wait for one if
   * there genuinely isn't one.
   *
   * The old recovery went straight to `listenForAudioElementSwap()`, whose
   * observer fires for newly ADDED subtrees. A host that replaces its player
   * rather than reusing it (pi.ai) has already inserted the replacement by the
   * time we notice ours is gone, so nothing was ever added afterwards to react
   * to: the observer waited forever, no `loadstart` reached the output machine,
   * and the host's own voice played on top of ours (#602).
   */
  rebindAudioElement() {
    const replacement = this.findAudioElement(document);
    if (replacement) {
      logger.debug("[AudioModule] Rebinding to the host's audio element");
      this.swapAudioElement(replacement);
      return;
    }
    this.listenForAudioElementSwap();
  }

  listenForAudioElementSwap() {
    this.swapObserver?.disconnect();
    if (ChatbotIdentifier.isChatbotType("pi") && !this.onHostAudioPlayback) {
      this.onHostAudioPlayback = () => this.applyHostAudioMute();
      for (const type of ["loadstart", "play", "playing"]) {
        document.addEventListener(type, this.onHostAudioPlayback, true);
      }
    }
    this.swapObserver = new MutationObserver((mutations) => {
      const addedPlayers = [];
      for (const mutation of mutations) {
        for (const addedNode of mutation.addedNodes) {
          if (addedNode.nodeType === Node.ELEMENT_NODE) addedPlayers.push(...findHostAudioElements(addedNode));
        }
      }
      if (!addedPlayers.length) return;
      this.applyHostAudioMute();
      // Preserve the shared output throughout buffering, playing and pausing,
      // including an explicit replay of an older native Pi reply.
      if (ChatbotIdentifier.isChatbotType("pi") && this.isSharedPlayback(this.audioElement)) return;
      const next = addedPlayers.find(audio => audio.isConnected && audio !== this.audioElement && this.isHostAudioCandidate(audio));
      if (next) this.swapAudioElement(next);
    });
    this.swapObserver.observe(document.body, { childList: true, subtree: true });
  }

  isSharedPlayback(audio) {
    if (!audio || this.useOffscreenAudio || audio !== this.audioElement) return false;
    const source = audioSource(audio);
    return !!source && source === this.sharedPlaybackSource;
  }

  shouldIgnoreHostPlayback(audio) {
    return this.providerIsSayPi && ChatbotIdentifier.isChatbotType("pi") &&
      isPiNativeSpeechSource(audioSource(audio)) && !this.isSharedPlayback(audio);
  }

  /**
   *
   * @param {HTMLAudioElement} audio
   * @param {some interpreted state machine} actor
   */
  addAudioListener(audio, event, listener) {
    this.audioPlaybackListeners ??= new Map();
    const listeners = this.audioPlaybackListeners.get(audio) ?? [];
    this.audioPlaybackListeners.set(audio, listeners);
    listeners.push([event, listener]);
    audio.addEventListener(event, listener);
  }

  registerAudioPlaybackEvents(audio, actor) {
    const sourced = new Set(["loadstart", "play", "error", "playing"]);
    const events = ["loadedmetadata", "canplaythrough", "pause", "ended", "seeked", "emptied", ...sourced];
    for (const event of events) {
      const listener = () => {
        // Muted/paused native speech must not drive the custom output actor:
        // its skipCurrent transition would stop the actual SayPi speech too.
        if (this.shouldIgnoreHostPlayback(audio)) {
          this.applyHostAudioMute();
          return;
        }
        if (audio === this.audioElement && ((event === "ended" && audio.ended) ||
            (event === "emptied" && !audioSource(audio)))) {
          this.sharedPlaybackSource = null;
        }
        actor.send({ type: event === "playing" ? "play" : event,
          ...(sourced.has(event) ? { source: audio.currentSrc } : {}) });
      };
      this.addAudioListener(audio, event, listener);
    }
  }

  registerSourceChangeEvents(audio, actor) {
    this.lastSource = audio.src;
    this.addAudioListener(audio, "loadstart", () => {
      if (this.shouldIgnoreHostPlayback(audio)) return;
      if (audio.currentSrc !== this.lastSource) {
        actor.send({ type: "sourceChanged" });
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
      async (detail) => {
        logger.debug("audio:load", detail, this.useOffscreenAudio ? "offscreen" : "in-page");
        this.lastAudioUrl = detail.url;
        if (this.useOffscreenAudio) {
          // Use offscreen bridge if available - now use loadAudio instead of playAudio
          await this.offscreenBridge.loadAudio(detail.url, true);
        } else {
          // Fallback to in-page audio
          const audio = this.findAudioElement(document) || new Audio();
          this.loadAudio(audio, detail.url);
        }
      },
      this
    );
    EventBus.on("audio:reload", async (reloadAudioRequest) => {
      if (this.useOffscreenAudio) {
        // For offscreen, we'll need to stop and play with a new URL
        const url = reloadAudioRequest?.bypassCache 
          ? CacheBuster.addCacheBuster(this.lastAudioUrl || "")
          : this.lastAudioUrl;
          
        if (url) {
          await this.offscreenBridge.loadAudio(url, reloadAudioRequest?.playImmediately !== false);
        }
      } else {
        // For in-page audio
        const audio = this.findAudioElement(document) || new Audio();
        if (reloadAudioRequest?.bypassCache) {
          const url = audio.src;
          audio.src = CacheBuster.addCacheBuster(url);
        }
        this.sharedPlaybackSource = audio.src;
        audio.load();
        if (reloadAudioRequest?.playImmediately) {
          audio.play();
        }
      }
    });
  }

  /* These events are used to control/pass requests to the audio module from other modules */
  registerAudioCommands(inputActor, outputActor) {
    // audio input (recording) commands
    EventBus.on("audio:setupRecording", function (e) {
      inputActor.send({ type: "acquire" });
    });

    EventBus.on("audio:tearDownRecording", function (e) {
      inputActor.send({ type: "release" });
    });

    EventBus.on("audio:startRecording", function (e) {
      // Check if Pi is currently speaking and stop her audio
      if (outputActor) {
        outputActor.send({ type: "pause" });
      }

      // Check if the microphone is acquired before starting?
      inputActor.send({ type: "acquire" });
      inputActor.send({ type: "start" });
    });
    EventBus.on("audio:stopRecording", function (e) {
      // soft stop recording
      inputActor.send({ type: "stopRequested" });
    });
    // audio input (recording) events (pass media recorder events -> audio input machine actor)
    EventBus.on("audio:dataavailable", (detail) => {
      inputActor.send({ type: "dataAvailable", ...detail });
    });
    EventBus.on("audio:input:stop", function (e) {
      // hard stop recording
      inputActor.send({ type: "stop" });
    });
    EventBus.on("audio:input:reconnect", function (e) {
      inputActor.send({ type: "release" });
      inputActor.send({ type: "acquire" });
      inputActor.send({ type: "start" });
    });

    // audio output (playback) commands
    EventBus.on("audio:skipNext", (e) => {
      logger.debug("Skipping next audio");
      if (outputActor) {
        outputActor.send({ type: "skipNext" });
      }
    });
    // Voice preview (design §4): audition a canned sample clip. The machine's
    // `preview` transition is idle-only and callActive-gated, so a preview can
    // never talk over live TTS or an active call — the gating lives there, not
    // here. Playback rides the same audio:load channel as conversation TTS.
    EventBus.on("audio:preview", (detail) => {
      if (outputActor && detail?.url) {
        outputActor.send({ type: "preview", source: detail.url });
      }
    });
    // Track the call boundary so previews are refused for its whole duration,
    // even between the call's own utterances (session:* originate in
    // ConversationMachine — the canonical call-boundary signal, not the DOM).
    EventBus.on("session:started", () => {
      if (outputActor) {
        outputActor.send({ type: "callStarted" });
      }
    });
    EventBus.on("session:ended", () => {
      if (outputActor) {
        outputActor.send({ type: "callEnded" });
      }
    });
    EventBus.on("audio:skipCurrent", async (e) => {
      // pause both offscreen and onscreen audio
      this.stopOnscreenAudio();
      if (this.useOffscreenAudio) {
        await this.offscreenBridge.stopAudio();
      }
    });
    EventBus.on("audio:output:play", async (e) => {
      if (this.useOffscreenAudio) {
        await this.offscreenBridge.resumeAudio();
      } else {
        this.audioElement.play();
      }
    });
    EventBus.on("audio:output:pause", async (e) => {
      logger.debug("[AudioModule] [audio:output:pause] Pausing audio");
      this.cancelPendingPlayback();
      // pause both offscreen and onscreen audio
      if (this.useOffscreenAudio) {
        await this.offscreenBridge.pauseAudio();
      }
      this.audioElement.pause();
    });
    EventBus.on("audio:output:resume", async (e) => {
      if (this.useOffscreenAudio) {
        await this.offscreenBridge.resumeAudio();
      }
      this.audioElement.play();
    });

    EventBus.on("saypi:tts:replaying", (e) => {
      // notify the audio output machine that the next audio is a replay
      if (outputActor) {
        outputActor.send({ type: "replaying" });
      }
    });
  }

  stopOnscreenAudio() {
    this.sharedPlaybackSource = null;
    this.cancelPendingPlayback();
    this.audioElement.pause();

    // Skip to the end to simulate the completion of the audio, preventing it from being resumed
    if (Number.isFinite(this.audioElement.duration) &&
      !isNaN(this.audioElement.duration)) {
      this.audioElement.currentTime = this.audioElement.duration;
    }
  }

  /**
   * Load an audio file into the main audio element,
   * replacing the current audio source, i.e. Pi's speech.
   *
   * To invoke this function with loose coupling to the audio module,
   * raise a "audio:load" event with the URL of the audio file to load.
   * @param {string} url
   */
  async loadAudio(audioElement, url, play = true) {
    if (url) {
      // Store the last URL for potential cache busting on reload
      this.lastAudioUrl = url;

      this.cancelPendingPlayback();

      if (this.useOffscreenAudio) {
        // Use offscreen bridge - now with loadAudio instead of playAudio
        await this.offscreenBridge.loadAudio(url, play);
        return;
      }
      
      // Track this explicit load independently of the URL retained for reload.
      // Stop/completion revoke the shared-player exemption; pause preserves it.
      this.sharedPlaybackSource = url;
      // Fallback to in-page audio. Quiet/whisper mode plays the reply softly (#437).
      audioElement.src = url;
      audioElement.volume = ttsVolumeForQuietMode(
        UserPreferenceModule.getInstance().getCachedQuietMode()
      );
      if (play) {
        const playbackController = new AbortController();
        this.pendingPlaybackController = playbackController;
        try {
          await this.playWhenBuffered(audioElement, {
            signal: playbackController.signal,
          });
          if (this.pendingPlaybackController === playbackController) {
            this.pendingPlaybackController = null;
          }
          logger.debug(`Playing audio from ${audioElement.currentSrc}`);
        } catch (error) {
          if (this.pendingPlaybackController === playbackController) {
            this.pendingPlaybackController = null;
          }
          if (error?.name === "AbortError") {
            logger.debug(
              `Playback aborted before start for ${audioElement.currentSrc}`
            );
            return;
          }
          logger.error(
            `Error playing audio from ${audioElement.currentSrc}`,
            error
          );
        }
      } else {
        try {
          audioElement.load();
          logger.debug(`Loaded audio from ${audioElement.currentSrc}`);
        } catch (error) {
          logger.error(
            `Error loading audio from ${audioElement.currentSrc}`,
            error
          );
        }
      }
    }
  }

  playWhenBuffered(audioElement, { signal } = {}) {
    return new Promise((resolve, reject) => {
      let playbackStarted = false;
      let timeoutId = null;
      const createAbortError = () => {
        if (typeof DOMException === "function") {
          return new DOMException(
            "Playback start was aborted before buffering completed.",
            "AbortError"
          );
        }
        const abortError = new Error(
          "Playback start was aborted before buffering completed."
        );
        abortError.name = "AbortError";
        return abortError;
      };
      const cleanup = () => {
        audioElement.removeEventListener("canplaythrough", onCanPlayThrough);
        audioElement.removeEventListener("error", onError);
        if (timeoutId !== null) {
          clearTimeout(timeoutId);
        }
        if (signal) {
          signal.removeEventListener("abort", onAbort);
        }
      };

      const startPlayback = () => {
        if (playbackStarted) {
          return;
        }
        if (signal?.aborted) {
          cleanup();
          reject(createAbortError());
          return;
        }
        playbackStarted = true;
        cleanup();
        try {
          const playResult = audioElement.play();
          if (playResult && typeof playResult.then === "function") {
            playResult.then(resolve).catch((error) => {
              reject(error);
            });
          } else {
            resolve();
          }
        } catch (error) {
          reject(error);
        }
      };

      const onCanPlayThrough = () => {
        startPlayback();
      };

      const onError = (event) => {
        cleanup();
        reject(event?.error || audioElement.error || event);
      };

      function onAbort() {
        cleanup();
        reject(createAbortError());
      }

      audioElement.addEventListener("canplaythrough", onCanPlayThrough);
      audioElement.addEventListener("error", onError);
      if (signal) {
        if (signal.aborted) {
          onAbort();
          return;
        }
        signal.addEventListener("abort", onAbort, { once: true });
      }

      timeoutId = setTimeout(() => {
        startPlayback();
      }, INITIAL_PLAYBACK_BUFFER_TIMEOUT_MS);

      if (
        typeof HTMLMediaElement !== "undefined" &&
        audioElement.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA
      ) {
        startPlayback();
        return;
      }

      try {
        audioElement.load();
      } catch (error) {
        cleanup();
        reject(error);
      }
    });
  }

  cancelPendingPlayback() {
    if (this.pendingPlaybackController) {
      this.pendingPlaybackController.abort();
      this.pendingPlaybackController = null;
    }
  }

  /**
   * Register debug events on the audio element to track the audio lifecycle
   * This function is only informational, it does not handle any errors.
   */
  registerLifecycleDebug() {
    // Only register if we're not using offscreen audio
    if (this.useOffscreenAudio || !this.audioElement) {
      return;
    }
    
    let starttime;
    this.audioElement.onerror = (event) => {
      logger.error(
        `[audio lifecycle] Error playing audio from ${this.audioElement.currentSrc}`,
        event
      );
    };

    this.audioElement.onloadstart = () => {
      logger.debug(`[audio lifecycle] Loading audio from ${this.audioElement.currentSrc}`);
      starttime = Date.now();
    };

    // Handle successful loading and playing of the audio
    this.audioElement.onloadeddata = () => {
      const endtime = Date.now();
      const elapsedtime = (endtime - starttime) / 1000;
      logger.debug(
        `[audio lifecycle] Audio is loaded after ${elapsedtime.toFixed(1)}s from ${
          this.audioElement.currentSrc
        }`
      );
    };

    this.audioElement.oncanplay = () => {
      const endtime = Date.now();
      const elapsedtime = (endtime - starttime) / 1000;
      logger.debug(
        `[audio lifecycle] Audio is ready to play after ${elapsedtime.toFixed(1)}s from ${
          this.audioElement.currentSrc
        }`
      );
    };

    this.audioElement.oncanplaythrough = () => {
      const endtime = Date.now();
      const elapsedtime = (endtime - starttime) / 1000;
      logger.debug(
        `[audio lifecycle] Audio is ready to play through after ${elapsedtime.toFixed(1)}s from ${
          this.audioElement.currentSrc
        }`
      );
    };

    this.audioElement.onpause = () => {
      const endtime = Date.now();
      const elapsedtime = (endtime - starttime) / 1000;
      logger.debug(`[audio lifecycle] Audio playback paused after ${elapsedtime.toFixed(1)}s`);
    };

    this.audioElement.onabort = () => {
      logger.debug(`[audio lifecycle] Audio playback aborted for ${this.audioElement.currentSrc}`);
    };

    this.audioElement.onstalled = (event) => {
      const isPotentialRangeRequestFailure = 
        this.audioElement.networkState === 2 && // NETWORK_LOADING
        this.audioElement.readyState === 1 &&   // HAVE_METADATA
        this.audioElement.buffered.length === 0 &&
        this.audioElement.duration === Infinity;

      if (isPotentialRangeRequestFailure && isSafari()) {
        logger.debug('[audio lifecycle] Detected potential Safari range request failure');
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
      
      logger.debug(
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
      logger.debug(`[audio lifecycle] Audio loading suspended for ${this.audioElement.currentSrc}`);
    };

    this.audioElement.onemptied = () => {
      logger.debug(`[audio lifecycle] Audio element emptied`);
    };

    // Handle audio playback completion
    this.audioElement.onended = () => {
      const endtime = Date.now();
      const elapsedtime = (endtime - starttime) / 1000;
      logger.debug(`[audio lifecycle] Audio playback ended after ${elapsedtime.toFixed(1)}s`);
    };
  }

  /**
   * Register error events on the audio element to handle slow responses from pi.ai
   * @param {HTMLAudioElement} audioElement
   * @param {SlowResponseHandlerAdapter | InterpretedActor} actor
   */
  registerAudioErrorEvents(audio, actor) {
    // Only register if we're not using offscreen audio
    if (this.useOffscreenAudio || !audio) {
      return;
    }
    
    // Handle explicit errors
    this.addAudioListener(audio, "error", (event) => {
      if (this.shouldIgnoreHostPlayback(audio)) return;
      actor.send({
        type: "error",
        source: audio.currentSrc,
        error: audio.error
      });
    });

    // Handle Safari range request failures
    this.addAudioListener(audio, "stalled", (event) => {
      if (this.shouldIgnoreHostPlayback(audio)) return;
      const isPotentialRangeRequestFailure = 
        audio.networkState === 2 && // NETWORK_LOADING
        audio.readyState === 1 &&   // HAVE_METADATA
        audio.buffered.length === 0 &&
        audio.duration === Infinity;

      if (isPotentialRangeRequestFailure && isSafari()) {
        logger.debug('[audio lifecycle] Detected Safari range request failure, triggering retry');
        actor.send({
          type: "error",
          source: audio.currentSrc,
          detail: "Safari range request failure detected",
          error: audio.error
        });
      }
    });
  }

  /**
   * Register EventBus listeners for offscreen audio events and forward them to the audio output actor
   * This mirrors the behavior of registerAudioPlaybackEvents but for events from offscreen audio
   * Only the main audio output actor needs to respond to offscreen events - voice converter and
   * retry machines are designed specifically for in-page audio elements.
   * 
   * @param {some interpreted state machine} outputActor - The audio output actor
   */
  registerOffscreenAudioEvents(outputActor) {
    logger.debug("[AudioModule] Registering offscreen audio event listeners for output actor only");
    
    // Events that don't include source information (matching events array in registerAudioPlaybackEvents)
    const standardEvents = [
      "loadedmetadata",
      "canplaythrough", 
      "pause",
      "ended",
      "seeked",
      "emptied"
    ];
    
    // Events that include source information (matching sourcedEvents in registerAudioPlaybackEvents)
    const sourcedEvents = ["loadstart", "play", "error"];
    
    // Register listeners for standard events
    standardEvents.forEach((event) => {
      EventBus.on(`audio:offscreen:${event}`, (detail) => {
        logger.debug(`[AudioModule] Forwarding offscreen event to audio output actor: ${event}`);
        outputActor.send({ type: event });
      }, this);
    });
    
    // Register listeners for sourced events  
    sourcedEvents.forEach((event) => {
      EventBus.on(`audio:offscreen:${event}`, (detail) => {
        logger.debug(`[AudioModule] Forwarding offscreen sourced event to audio output actor: ${event}`, detail);
        const eventDetail = { source: detail?.source || 'offscreen' };
        outputActor.send({ type: event, ...eventDetail });
      }, this);
    });
    
    // Handle special case for 'playing' event which maps to 'play' 
    EventBus.on("audio:offscreen:playing", (detail) => {
      logger.debug("[AudioModule] Forwarding offscreen 'playing' event as 'play' to audio output actor", detail);
      const eventDetail = { source: detail?.source || 'offscreen' };
      outputActor.send({ type: "play", ...eventDetail });
    }, this);
  }
}
