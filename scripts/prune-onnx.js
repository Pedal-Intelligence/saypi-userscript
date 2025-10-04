#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = __dirname;
const workspaceRoot = path.join(projectRoot, '..');
const publicDir = path.join(workspaceRoot, 'public');
const pythonPruneScript = path.join(workspaceRoot, 'scripts', 'prune_onnx_model.py');

const ONNX_PATTERN = /^silero_vad.*\.onnx$/;

function findPythonExecutable() {
  const venvCandidates = [
    path.join(workspaceRoot, '.venv', 'bin', 'python'),
    path.join(workspaceRoot, '.venv', 'Scripts', 'python.exe')
  ];

  const candidates = [process.env.PYTHON, ...venvCandidates, 'python3', 'python']
    .filter(Boolean);

  for (const candidate of candidates) {
    const result = spawnSync(candidate, ['--version'], { stdio: 'ignore' });
    if (result.status === 0) {
      return candidate;
    }
  }

  return null;
}

function pruneModel(pythonExec, sourcePath) {
  const tempPath = `${sourcePath}.optimized`;
  const args = [
    pythonPruneScript,
    '--input',
    sourcePath,
    '--output',
    tempPath,
  ];

  console.log(`Pruning ONNX model: ${path.basename(sourcePath)}`);

  const result = spawnSync(pythonExec, args, { stdio: 'inherit' });

  if (result.status !== 0) {
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
    throw new Error(
      `Failed to prune ${path.basename(sourcePath)}. ` +
      'Run "npm run setup:python" to provision the local Python environment (requires Python 3.11.x).'
    );
  }

  if (!fs.existsSync(tempPath)) {
    throw new Error(`Optimization did not produce output file for ${path.basename(sourcePath)}.`);
  }

  fs.copyFileSync(tempPath, sourcePath);
  fs.unlinkSync(tempPath);

  console.log(`✓ Pruned ${path.basename(sourcePath)}`);
}

function main() {
  if (!fs.existsSync(publicDir)) {
    console.log('Public directory not found; skipping ONNX pruning.');
    return;
  }

  const models = fs.readdirSync(publicDir)
    .filter(file => ONNX_PATTERN.test(file))
    .map(file => path.join(publicDir, file));

  if (models.length === 0) {
    console.log('No Silero VAD ONNX models found in public/. Skipping pruning.');
    return;
  }

  const pythonExec = findPythonExecutable();
  if (!pythonExec) {
    throw new Error('Python interpreter not found. Set PYTHON environment variable or install python3 to enable ONNX pruning.');
  }

  try {
    models.forEach(modelPath => pruneModel(pythonExec, modelPath));
  } catch (error) {
    console.error(error.message || error);
    process.exit(1);
  }
}

main();
