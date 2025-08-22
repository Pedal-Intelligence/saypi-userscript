#!/usr/bin/env node

/**
 * This script copies required ONNX runtime files from node_modules to the public directory.
 * It should be run as part of the build process to ensure all necessary files are available.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define source and destination directories
// Prefer the version nested under vad-web to match its pinned ORT version
const nestedOrtDir = path.join(__dirname, 'node_modules', '@ricky0123', 'vad-web', 'node_modules', 'onnxruntime-web', 'dist');
const topLevelOrtDir = path.join(__dirname, 'node_modules', 'onnxruntime-web', 'dist');
const sourceDir = fs.existsSync(nestedOrtDir) ? nestedOrtDir : topLevelOrtDir;
const destDir = path.join(__dirname, 'public');

// Ensure destination directory exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Files to copy - both .wasm and .mjs files
console.log('Copying ONNX runtime files from:', sourceDir);

// Get all files from the source directory that match the patterns
const onnxFiles = fs.readdirSync(sourceDir).filter(
  file => (file.startsWith('ort-wasm') && (file.endsWith('.wasm') || file.endsWith('.mjs')))
);

// Copy each file
let copiedCount = 0;
onnxFiles.forEach(file => {
  const sourcePath = path.join(sourceDir, file);
  const destPath = path.join(destDir, file);
  
  try {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`✓ Copied ${file}`);
    copiedCount++;
  } catch (err) {
    console.error(`✗ Failed to copy ${file}: ${err.message}`);
  }
});

console.log(`Finished copying ${copiedCount} ONNX runtime files.`);
