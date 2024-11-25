import { getResourceUrl } from "../ResourceModule";
import { simd, threads } from "wasm-feature-detect";

// Types for capability detection results
export interface BasicAudioSupport {
  echoCancellation: boolean;
  autoGainControl: boolean;
  noiseSuppression: boolean;
}

export interface AppliedAudioConstraints extends BasicAudioSupport {
  deviceId: string | undefined;
  channelCount: number | undefined;
  sampleRate: number | undefined;
}

export interface EchoCancellationQuality {
  echoCancellationQuality: number;
  browser: string;
  audioContextSampleRate: number;
  testTimestamp: string;
  details?: {
    echoFrequency: number;
    maxAmplitude: number;
    samplesAnalyzed: number;
    echoDetections: number;
    audioPlaybackVerified: boolean;
    signalDetected: boolean;
  };
}

export interface BrowserSpecificNotes {
  message?: string;
  recommendation?: string;
  relevantSettings?: string[];
}

export interface WebAssemblySupport {
  simd: boolean;
  threads: boolean;
  memory: {
    initial: boolean;
    growth: boolean;
    maximumSize: number;  // in pages (64KB each)
  };
}

export interface AudioCapabilityResults {
  basicSupport: BasicAudioSupport;
  appliedConstraints: AppliedAudioConstraints | null;
  echoCancellationQuality: EchoCancellationQuality | null;
  webAssembly: WebAssemblySupport;  // Replace individual SIMD/threads fields
  browserSpecificNotes: BrowserSpecificNotes;
}

export interface AudioQualityThresholds {
  minimumEchoQuality: number;
  preferredEchoQuality: number;
}

export interface AudioFeatureConfig {
  enableInterruptions: boolean;
  showQualityWarning: boolean;
  requiresManualConfig: boolean;
  audioQualityDetails: AudioCapabilityResults;
}

export class AudioCapabilityDetector {
  private async checkBasicAudioSupport(): Promise<BasicAudioSupport> {
    const support = await navigator.mediaDevices.getSupportedConstraints();
    return {
      echoCancellation: support.echoCancellation ?? false,
      autoGainControl: support.autoGainControl ?? false,
      noiseSuppression: support.noiseSuppression ?? false,
    };
  }

  private async testAudioConstraints(): Promise<AppliedAudioConstraints | null> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          autoGainControl: true,
          noiseSuppression: true,
          channelCount: 1,
        },
      });

      const track = stream.getAudioTracks()[0];
      const settings = track.getSettings();

      // Clean up
      stream.getTracks().forEach((track) => track.stop());

      return {
        echoCancellation: settings.echoCancellation ?? false,
        autoGainControl: settings.autoGainControl ?? false,
        noiseSuppression: settings.noiseSuppression ?? false,
        deviceId: settings.deviceId,
        channelCount: settings.channelCount,
        sampleRate: settings.sampleRate,
      };
    } catch (err) {
      console.error("Audio constraint test failed:", err);
      return null;
    }
  }

  private async testEchoCancellation(): Promise<EchoCancellationQuality | null> {
    const AudioContext =
      (window as any).AudioContext || (window as any).webkitAudioContext;
    const audioContext = new AudioContext();
    let qualityScore = 1.0;

    try {
      // Get microphone stream with forced mono
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          autoGainControl: true,
          noiseSuppression: true,
          channelCount: 1,
        },
      });

      // Set up analyzer
      const source = audioContext.createMediaStreamSource(stream);
      const analyzer = audioContext.createAnalyser();
      analyzer.fftSize = 2048;
      source.connect(analyzer);

      // Load and play test audio
      const audioElement = new Audio(getResourceUrl("audio/test-tone.mp3"));

      // Verify audio playback starts
      let audioIsPlaying = false;
      const playbackPromise = new Promise<void>((resolve, reject) => {
        audioElement.addEventListener("playing", () => {
          audioIsPlaying = true;
          resolve();
        });

        audioElement.addEventListener("error", (e) => {
          const error = audioElement.error;
          if (error) {
            switch (error.code) {
              case MediaError.MEDIA_ERR_ABORTED:
                reject(new Error("Audio playback aborted"));
                break;
              case MediaError.MEDIA_ERR_NETWORK:
                reject(new Error("Network error while loading audio"));
                break;
              case MediaError.MEDIA_ERR_DECODE:
                reject(new Error("Audio decode failed"));
                break;
              case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                reject(new Error("Audio format not supported"));
                break;
              default:
                reject(new Error(`Audio error: ${error.message}`));
            }
          } else {
            reject(new Error("Unknown audio error occurred"));
          }
        });

        setTimeout(() => {
          if (!audioIsPlaying) {
            reject(new Error("Audio playback failed to start (timeout)"));
          }
        }, 1000);
      });

      try {
        await audioElement.play().catch((e) => {
          if (e.name === "NotAllowedError") {
            throw new Error(
              "Audio playback blocked. Please initiate test from a user interaction."
            );
          } else if (e.name === "AbortError") {
            throw new Error(
              "Audio playback aborted. The browser may be blocking autoplay."
            );
          } else {
            throw new Error(`Unable to play test audio: ${e.message}`);
          }
        });
        await playbackPromise;
      } catch (playError) {
        console.error("Echo test audio playback failed:", playError);
        throw playError; // Re-throw to be caught by outer try-catch
      }

      const dataArray = new Float32Array(analyzer.frequencyBinCount);
      let echoSamples = 0;
      let totalSamples = 0;
      let maxRms = 0;
      let hasValidSignal = false;

      // Monitor for 3 seconds
      await new Promise<void>((resolve) => {
        const checkEcho = () => {
          analyzer.getFloatTimeDomainData(dataArray);
          const rms = Math.sqrt(
            dataArray.reduce((acc, val) => acc + val * val, 0) /
              dataArray.length
          );

          // Check if we're getting any signal
          if (rms > 0.01) {
            hasValidSignal = true;
          }

          totalSamples++;
          if (rms > 0.05) {
            echoSamples++;
            maxRms = Math.max(maxRms, rms);
          }
        };

        const interval = setInterval(checkEcho, 100);
        setTimeout(() => {
          clearInterval(interval);
          resolve();
        }, 3000);
      });

      // Cleanup
      audioElement.pause();
      audioElement.remove();
      stream.getTracks().forEach((track) => track.stop());
      await audioContext.close();

      // Validate test results
      if (!hasValidSignal || maxRms < 0.01) {
        console.warn(
          "Echo cancellation test invalid: No audio signal detected"
        );
        return null;
      }

      // Compute quality score based on multiple factors
      const echoFrequency = echoSamples / totalSamples;
      const amplitudePenalty = Math.min(maxRms, 1);

      // Calculate final score (0 to 1)
      qualityScore = Math.max(
        0,
        1 - (echoFrequency * 0.7 + amplitudePenalty * 0.3)
      );

      return {
        echoCancellationQuality: qualityScore,
        browser: navigator.userAgent,
        audioContextSampleRate: audioContext.sampleRate,
        testTimestamp: new Date().toISOString(),
        details: {
          echoFrequency,
          maxAmplitude: maxRms,
          samplesAnalyzed: totalSamples,
          echoDetections: echoSamples,
          audioPlaybackVerified: audioIsPlaying,
          signalDetected: hasValidSignal,
        },
      };
    } catch (err) {
      console.error("Echo cancellation test failed:", err);

      // Specific error handling
      if (err instanceof DOMException) {
        switch (err.name) {
          case "NotAllowedError":
            console.error("Microphone access denied by user");
            break;
          case "NotFoundError":
            console.error("No microphone found");
            break;
          case "NotReadableError":
            console.error("Microphone is already in use");
            break;
          default:
            console.error(`Device error: ${err.message}`);
        }
      }

      // Cleanup
      if (audioContext.state === "running") {
        await audioContext.close();
      }
      return null;
    }
  }

  private async checkSimdSupport(): Promise<boolean> {
    try {
      const isSimdSupported = await simd();
      console.log(
        `WebAssembly SIMD support: ${isSimdSupported ? "Enabled" : "Disabled"}`
      );
      return isSimdSupported;
    } catch (error) {
      console.error("Error detecting SIMD support:", error);
      return false;
    }
  }

  private async checkThreadingSupport(): Promise<boolean> {
    try {
      const isThreadingSupported = await threads();
      console.log(
        `WebAssembly Threading support: ${isThreadingSupported ? "Enabled" : "Disabled"}`
      );
      return isThreadingSupported;
    } catch (error) {
      console.error("Error detecting threading support:", error);
      return false;
    }
  }

  private async checkWebAssemblyMemory(): Promise<{
    initial: boolean;
    growth: boolean;
    maximumSize: number;
  }> {
    try {
      // Test initial memory allocation (32MB)
      const initialPages = 512; // 32MB (512 * 64KB)
      let memory: WebAssembly.Memory | null = null;
      
      try {
        memory = new WebAssembly.Memory({ 
          initial: initialPages,
          maximum: initialPages * 2
        });
        console.log(`Successfully allocated ${initialPages * 64}KB initial WebAssembly memory`);
      } catch (error) {
        console.warn('Failed to allocate initial WebAssembly memory:', error);
        return {
          initial: false,
          growth: false,
          maximumSize: 0
        };
      }

      // Test memory growth
      let maxPages = initialPages;
      const growthTestStep = 256; // Test growth in 16MB increments
      let canGrow = true;

      try {
        while (canGrow && maxPages < 65536) { // 65536 is the theoretical maximum
          try {
            memory.grow(growthTestStep);
            maxPages += growthTestStep;
          } catch (error) {
            canGrow = false;
          }
        }

        console.log(`Maximum WebAssembly memory: ${maxPages * 64}KB (${maxPages} pages)`);
        console.log("Memory growth test completed successfully");
      } catch (error) {
        console.warn('Error during memory growth test:', error);
      }

      return {
        initial: true,
        growth: maxPages > initialPages,
        maximumSize: maxPages
      };
    } catch (error) {
      console.error('WebAssembly memory test failed:', error);
      return {
        initial: false,
        growth: false,
        maximumSize: 0
      };
    }
  }

  async assessAudioCapabilities(): Promise<AudioCapabilityResults> {
    const isFirefox = navigator.userAgent.toLowerCase().includes("firefox");

    const basicSupport = await this.checkBasicAudioSupport();
    const appliedConstraints = await this.testAudioConstraints();
    const simdSupported = await this.checkSimdSupport();
    const threadsSupported = await this.checkThreadingSupport();
    const memorySupport = await this.checkWebAssemblyMemory();

    const results: AudioCapabilityResults = {
      basicSupport,
      appliedConstraints,
      echoCancellationQuality: null,
      webAssembly: {
        simd: simdSupported,
        threads: threadsSupported,
        memory: memorySupport
      },
      browserSpecificNotes: {},
    };

    if (isFirefox) {
      results.browserSpecificNotes = {
        message:
          "Firefox's echo cancellation implementation may vary. Consider testing in real conditions.",
        recommendation:
          "Users may need to manually enable echo cancellation in about:config",
        relevantSettings: [
          "media.getusermedia.aec_enabled",
          "media.getusermedia.agc_enabled",
          "media.getusermedia.noise_enabled",
        ],
      };
    }

    // Add browser-specific notes based on memory constraints
    if (!memorySupport.initial) {
      results.browserSpecificNotes.message = 
        "This browser cannot allocate sufficient WebAssembly memory for voice detection.";
      results.browserSpecificNotes.recommendation = 
        "Voice detection features may be unavailable. Consider updating your browser or operating system.";
    } else if (!memorySupport.growth) {
      results.browserSpecificNotes.message = 
        "This browser has limited WebAssembly memory growth capabilities.";
      results.browserSpecificNotes.recommendation = 
        "Voice detection features may be unstable. Consider updating your browser or operating system.";
    }

    // Only run echo test if basic support checks pass
    if (
      basicSupport.echoCancellation &&
      appliedConstraints?.echoCancellation
    ) {
      results.echoCancellationQuality = await this.testEchoCancellation();
    }

    return results;
  }

  async configureAudioFeatures(
    thresholds: AudioQualityThresholds
  ): Promise<AudioFeatureConfig> {
    const capabilities = await this.assessAudioCapabilities();

    return {
      enableInterruptions:
        (capabilities.echoCancellationQuality?.echoCancellationQuality ?? 0) >=
        thresholds.minimumEchoQuality,
      showQualityWarning:
        (capabilities.echoCancellationQuality?.echoCancellationQuality ?? 0) <
        thresholds.preferredEchoQuality,
      requiresManualConfig:
        capabilities.browserSpecificNotes?.recommendation != null,
      audioQualityDetails: capabilities,
    };
  }
}
