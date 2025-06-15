# Silero VAD v5 Optimization Configuration

Optimizing voice activity detection for short utterances and first words requires careful tuning of Silero VAD v5 parameters through the @ricky0123/vad-web library's RealTimeVADOptions interface. This configuration guide provides specific parameter values and ranges proven effective for real-time voice applications.

## RealTimeVADOptions interface overview

The @ricky0123/vad-web library exposes comprehensive configuration through the **RealTimeVADOptions** interface, which extends **FrameProcessorOptions** with callback and asset configuration options. **Silero VAD v5 represents a significant improvement** over legacy versions, offering 3x faster inference, support for 6000+ languages, and enhanced accuracy with ROC-AUC scores of 0.96 versus 0.91 for v4.

### Core VAD parameters for short utterance optimization

**positiveSpeechThreshold** (default: 0.5): The probability threshold above which Silero VAD considers audio as speech. **For improved short utterance detection, use values between 0.3-0.4** rather than the default 0.5. This increased sensitivity captures quiet speech onsets and brief utterances while accepting slightly more false positives.

**negativeSpeechThreshold** (default: 0.35): The threshold below which audio is considered non-speech. Maintain the traditional relationship of **0.15 less than positiveSpeechThreshold**. For a 0.35 positive threshold, set this to 0.2; for 0.4 positive, use 0.25.

**redemptionFrames** (default: 8): Grace period frames before triggering speech end. **Increase to 10-12 frames for short utterances** to prevent premature cutoff of trailing speech sounds. Each frame represents ~96ms at 16kHz with 1536 samples.

**minSpeechFrames** (default: 3): Minimum frames required for valid speech segments. **Reduce to 2 frames (approximately 200ms) for capturing very short utterances** like "yes," "no," or brief confirmations. However, values below 2 significantly increase false positives from mouth sounds.

**preSpeechPadFrames** (default: 1): Frames prepended to speech segments. **Increase to 2-3 frames for better first-word capture**, ensuring speech onsets aren't truncated. This adds approximately 200-300ms of audio before detected speech starts.

### Advanced timing and sensitivity parameters

**frameSamples** (fixed: 1536): Audio samples per frame for 16kHz processing. **Do not modify this value** as Silero VAD v5 was specifically trained with this window size, and changes will degrade model performance.

**submitUserSpeechOnPause** (default: false): Whether pausing VAD triggers speech end callback. Keep as false for continuous monitoring applications but consider true for push-to-talk style interfaces.

### Optimized configuration examples

**High sensitivity configuration for short utterances:**
```javascript
const highSensitivityConfig = {
  positiveSpeechThreshold: 0.35,
  negativeSpeechThreshold: 0.2,
  redemptionFrames: 12,
  minSpeechFrames: 2,
  preSpeechPadFrames: 3,
  frameSamples: 1536, // Fixed - do not change
  submitUserSpeechOnPause: false
};
```

**Balanced configuration for general voice interfaces:**
```javascript
const balancedConfig = {
  positiveSpeechThreshold: 0.4,
  negativeSpeechThreshold: 0.25,
  redemptionFrames: 10,
  minSpeechFrames: 3,
  preSpeechPadFrames: 2,
  frameSamples: 1536,
  submitUserSpeechOnPause: false
};
```

**Conservative configuration for noisy environments:**
```javascript
const conservativeConfig = {
  positiveSpeechThreshold: 0.6,
  negativeSpeechThreshold: 0.45,
  redemptionFrames: 8,
  minSpeechFrames: 4,
  preSpeechPadFrames: 1,
  frameSamples: 1536,
  submitUserSpeechOnPause: false
};
```

## Implementation strategies for specific use cases

**Transcription and dictation applications** benefit from the high sensitivity configuration with additional post-processing to merge segments separated by less than 100ms. This captures natural speech patterns including brief pauses for thinking.

**Voice assistants and command interfaces** should use the balanced configuration, which provides good responsiveness while maintaining reasonable false positive rates. The increased preSpeechPadFrames ensures wake words and commands aren't truncated.

**Live conversation applications** may require the conservative configuration in noisy environments, accepting some missed short utterances in favor of cleaner audio segments and reduced processing overhead.

## Callback configuration for enhanced detection

The library provides several callback options that enable sophisticated detection strategies:

**onFrameProcessed callback** allows monitoring of per-frame VAD probabilities, enabling adaptive threshold adjustment based on background noise levels. Implement noise floor detection by averaging probabilities during silent periods.

**onVADMisfire callback** triggers when potential speech segments are discarded due to minSpeechFrames constraints. Monitor this callback's frequency to tune minSpeechFrames—high misfire rates suggest the threshold is too restrictive.

**onSpeechStart and onSpeechEnd callbacks** should implement buffering strategies for short utterances. Maintain a circular buffer of recent audio to prepend additional context when speech begins, improving downstream processing accuracy.

## Performance implications and optimization

Silero VAD v5 processes 30ms audio chunks in under 1ms on modern CPU hardware, making it suitable for real-time applications. The ONNX runtime provides 10% better performance than PyTorch implementations while maintaining identical accuracy.

**Memory management** becomes critical with sensitive configurations that generate more speech segments. Implement efficient buffer recycling and consider segment length limits to prevent memory accumulation during long conversations.

**CPU usage scaling** depends primarily on the number of concurrent VAD instances rather than individual parameter settings. A single CPU core can handle 50-100 concurrent VAD streams with properly optimized buffer management.

## Asset configuration for production deployment

For production applications, specify explicit asset paths rather than relying on CDN defaults:

```javascript
const productionConfig = {
  // VAD parameters...
  positiveSpeechThreshold: 0.4,
  
  // Asset configuration
  baseAssetPath: "/assets/vad/",
  onnxWASMBasePath: "/wasm/",
  modelURL: "/models/silero_vad_v5.onnx"
};
```

Ensure the following files are served from your asset paths:
- **vad.worklet.bundle.min.js** (audio worklet processor)
- **silero_vad_v5.onnx** (VAD model file, 2MB)
- ONNX Runtime Web WASM files for browser compatibility

## Validation and testing recommendations

**Test with representative audio samples** covering your expected use cases: short confirmations, natural conversation patterns, background noise levels, and edge cases like whispered speech or distant microphones.

**Monitor callback frequencies** during testing to validate configuration effectiveness. High onVADMisfire rates indicate overly restrictive minSpeechFrames settings, while frequent onSpeechStart/onSpeechEnd cycles suggest threshold instability.

**Measure end-to-end latency** from speech onset to application response, ensuring VAD configuration doesn't introduce excessive delays that degrade user experience.

The optimal configuration balances sensitivity for short utterances with specificity against false positives, typically achieved with positiveSpeechThreshold values between 0.3-0.4, reduced minSpeechFrames to 2-3, and increased preSpeechPadFrames to 2-3 for comprehensive first-word capture.