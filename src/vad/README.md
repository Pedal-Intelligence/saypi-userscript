# Voice Activity Detection (VAD)

This directory contains the Voice Activity Detection implementation using ONNX Runtime and Silero VAD models.

## Why We Keep All 4 WASM Files

The extension includes 4 WASM file variants totaling 37MB. These are **all necessary** and cannot be reduced.

### What Are These Files?

- **WASM files** = ONNX Runtime (the inference engine that runs ML models)
- **ONNX files** = VAD models (speech detection weights/data)

### The 4 WASM Variants

1. **`ort-wasm.wasm` (8.8MB)**
   - Base version: No SIMD, no threading
   - Fallback for older browsers
   - Maximum compatibility

2. **`ort-wasm-threaded.wasm` (8.7MB)**
   - Adds Web Workers threading support
   - Better performance on multi-core systems
   - Requires SharedArrayBuffer support

3. **`ort-wasm-simd.wasm` (9.5MB)**
   - Adds SIMD (Single Instruction, Multiple Data) support
   - Faster mathematical operations
   - Significantly improves inference speed

4. **`ort-wasm-simd-threaded.wasm` (9.5MB)**
   - Combines both SIMD + threading
   - **Best performance** for modern browsers
   - Used by Chrome, Edge, Firefox (desktop)

### Runtime Selection

ONNX Runtime **dynamically selects** the best WASM file at runtime based on browser capabilities:

```
Modern Chrome/Edge/Firefox → ort-wasm-simd-threaded.wasm (fastest)
Older browsers with SIMD   → ort-wasm-simd.wasm
Browsers with threading    → ort-wasm-threaded.wasm
Legacy browsers            → ort-wasm.wasm (slowest but compatible)
```

This ensures:
- ✅ Maximum performance on capable browsers
- ✅ Graceful degradation on older browsers
- ✅ Universal compatibility

**Do not remove any of these WASM files** - they are all required for cross-browser support.

## Architecture

- `OnscreenVADClient.ts` - VAD client for content scripts (when CSP allows)
- `OffscreenVADClient.ts` - VAD client using offscreen documents (for strict CSP sites like Claude.ai)
- `VADClientInterface.ts` - Common interface for both implementations

## Dependencies

- `@ricky0123/vad-web` - Silero VAD models and ONNX Runtime wrapper
- `onnxruntime-web` - ONNX Runtime for WebAssembly
