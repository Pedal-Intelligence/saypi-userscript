#!/usr/bin/env node

/**
 * Copy the ONNX Runtime files the VAD loads at runtime from node_modules into public/,
 * so they ship as extension resources (they can't come from a CDN: MV3 forbids remote
 * code, and host-page CSP would block it anyway). Run by predev/prebuild and the e2e builds.
 *
 * Since onnxruntime-web 1.19, ORT ships ONE WebAssembly build for our use:
 * `ort-wasm-simd-threaded.wasm`, plus its `.mjs` glue. It runs single-threaded when we set
 * `env.wasm.numThreads = 1`, which we do, because MV3's CSP forbids the blob-backed worker
 * that threading needs. The other `ort-wasm-simd-threaded.*` variants in the package
 * (asyncify, JSEP/WebGPU, JSPI) are for backends we don't use, so they are not copied.
 * (Before #655 we shipped ORT 1.14's four variants, about 37 MB; this is about 14 MB.)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// vad-web depends on onnxruntime-web directly; npm dedupes it to our pinned top-level copy,
// but prefer a nested copy if the versions ever diverge, since that is the one vad-web loads.
const nestedOrtDir = path.join(__dirname, 'node_modules', '@ricky0123', 'vad-web', 'node_modules', 'onnxruntime-web', 'dist');
const topLevelOrtDir = path.join(__dirname, 'node_modules', 'onnxruntime-web', 'dist');
const sourceDir = fs.existsSync(nestedOrtDir) ? nestedOrtDir : topLevelOrtDir;
const destDir = path.join(__dirname, 'public');

const ORT_FILES = ['ort-wasm-simd-threaded.wasm', 'ort-wasm-simd-threaded.mjs'];

fs.mkdirSync(destDir, { recursive: true });
console.log('Copying ONNX runtime files from:', sourceDir);

let failed = 0;
for (const file of ORT_FILES) {
  try {
    fs.copyFileSync(path.join(sourceDir, file), path.join(destDir, file));
    console.log(`✓ Copied ${file}`);
  } catch (err) {
    console.error(`✗ Failed to copy ${file}: ${err.message}`);
    failed++;
  }
}

// A build without these files loads fine and then fails the first time the VAD starts,
// so fail the build instead.
if (failed) process.exit(1);
console.log(`Finished copying ${ORT_FILES.length} ONNX runtime files.`);
