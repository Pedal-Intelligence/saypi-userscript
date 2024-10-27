import { getResourceUrl } from "../ResourceModule";

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

export interface AudioCapabilityResults {
  basicSupport: BasicAudioSupport;
  appliedConstraints: AppliedAudioConstraints | null;
  echoCancellationQuality: EchoCancellationQuality | null;
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
      const audioElement = new Audio();
      audioElement.src = getResourceUrl("audio/test-tone.mp3");
      audioElement.loop = true;

      const audioSource = audioContext.createMediaElementSource(audioElement);
      const gainNode = audioContext.createGain();
      gainNode.gain.value = 0.5;

      audioSource.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Verify audio playback starts
      let audioIsPlaying = false;
      const playbackPromise = new Promise<void>((resolve, reject) => {
        audioElement.addEventListener("playing", () => {
          audioIsPlaying = true;
          resolve();
        });
        audioElement.addEventListener("error", (e) => {
          reject(new Error(`Audio playback failed: ${e.message}`));
        });

        // Timeout if audio doesn't start
        setTimeout(() => {
          if (!audioIsPlaying) {
            reject(new Error("Audio playback failed to start"));
          }
        }, 1000);
      });

      await audioElement.play();
      await playbackPromise;

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
      if (audioContext.state === "running") {
        await audioContext.close();
      }
      return null;
    }
  }

  async assessAudioCapabilities(): Promise<AudioCapabilityResults> {
    const isFirefox = navigator.userAgent.toLowerCase().includes("firefox");

    const results: AudioCapabilityResults = {
      basicSupport: await this.checkBasicAudioSupport(),
      appliedConstraints: await this.testAudioConstraints(),
      echoCancellationQuality: null,
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

    // Only run echo test if basic support checks pass
    if (
      results.basicSupport.echoCancellation &&
      results.appliedConstraints?.echoCancellation
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

// Usage example:
/*
const detector = new AudioCapabilityDetector();
const config = await detector.configureAudioFeatures({
  minimumEchoQuality: 0.5,
  preferredEchoQuality: 0.8
});

if (config.enableInterruptions) {
  // Enable interruption feature
}

if (config.showQualityWarning) {
  // Show warning to user about audio quality
}
*/
