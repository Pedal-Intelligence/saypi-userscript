#!/usr/bin/env node
/**
 * Push environment secrets to 1Password for cross-device sync.
 *
 * Usage:
 *   npm run env:push
 *   node scripts/1password-push.js
 *
 * Prerequisites:
 *   - 1Password CLI installed: https://developer.1password.com/docs/cli/get-started/
 *   - Authenticated with: op signin
 *
 * Configuration (optional environment variables):
 *   - OP_VAULT_NAME: Override default vault name (default: 'saypi-userscript-dev')
 *   - OP_ITEM_NAME: Override default item name (default: 'SayPi Dev Secrets')
 *
 * This script:
 * 1. Reads sensitive values from .env and .env.production
 * 2. Creates/updates a secure note in 1Password with the secrets
 * 3. Uses the configured vault (creates if missing)
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync, spawnSync } from 'node:child_process';
import dotenv from 'dotenv';

const root = process.cwd();
const VAULT_NAME = process.env.OP_VAULT_NAME || 'saypi-userscript-dev';
const ITEM_NAME = process.env.OP_ITEM_NAME || 'SayPi Dev Secrets';

/**
 * Check if 1Password CLI is available and authenticated
 */
function check1PasswordCLI() {
  try {
    execSync('op --version', { stdio: 'pipe' });
  } catch {
    console.error('❌ 1Password CLI not found. Install it from:');
    console.error('   https://developer.1password.com/docs/cli/get-started/');
    process.exit(1);
  }

  try {
    execSync('op account list', { stdio: 'pipe' });
  } catch {
    console.error('❌ Not signed in to 1Password. Run: op signin');
    process.exit(1);
  }
}

/**
 * Get or create vault
 */
function ensureVault() {
  try {
    const vaults = execSync('op vault list --format=json', { encoding: 'utf8' });
    const vaultList = JSON.parse(vaults);
    const existing = vaultList.find((v) => v.name === VAULT_NAME);

    if (existing) {
      return existing.id;
    }

    console.log(`Creating vault "${VAULT_NAME}"...`);
    const result = execSync(`op vault create "${VAULT_NAME}" --format=json`, { encoding: 'utf8' });
    const vault = JSON.parse(result);
    console.log(`✅ Vault created: ${vault.id}`);
    return vault.id;
  } catch (error) {
    console.error('❌ Failed to access/create vault:', error.message);
    process.exit(1);
  }
}

/**
 * Keys to sync to 1Password (sensitive values only).
 * Exported for testing.
 */
export const KEYS_TO_SYNC = [
  'VITE_GA_MEASUREMENT_ID',
  'VITE_GA_API_SECRET',
  'VITE_APP_SERVER_URL',
  'VITE_API_SERVER_URL',
  'VITE_AUTH_SERVER_URL',
  'VITE_GA_ENDPOINT',
];

/**
 * Extract secrets from parsed env object.
 * Exported for testing.
 * @param {Object} parsed - Parsed env file content
 * @param {string} prefix - Prefix for secret keys ('dev_' or 'prod_')
 * @returns {Object} - Secrets with prefixed keys
 */
export function extractSecrets(parsed, prefix) {
  const secrets = {};
  for (const key of KEYS_TO_SYNC) {
    if (parsed[key]) {
      secrets[`${prefix}${key}`] = parsed[key];
    }
  }
  return secrets;
}

/**
 * Read environment files and extract secrets
 */
function readSecrets() {
  const secrets = {};

  // Read .env
  const envPath = path.resolve(root, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const parsed = dotenv.parse(envContent);
    Object.assign(secrets, extractSecrets(parsed, 'dev_'));
  }

  // Read .env.production
  const prodEnvPath = path.resolve(root, '.env.production');
  if (fs.existsSync(prodEnvPath)) {
    const prodContent = fs.readFileSync(prodEnvPath, 'utf8');
    const parsed = dotenv.parse(prodContent);
    Object.assign(secrets, extractSecrets(parsed, 'prod_'));
  }

  return secrets;
}

/**
 * Save secrets to 1Password using spawnSync to avoid shell injection
 */
function saveSecrets(vaultId, secrets) {
  const secretCount = Object.keys(secrets).length;

  if (secretCount === 0) {
    console.error('❌ No secrets found in .env files');
    process.exit(1);
  }

  console.log(`Saving ${secretCount} secrets to 1Password...`);

  // Check if item exists
  let itemExists = false;
  try {
    execSync(`op item get "${ITEM_NAME}" --vault="${VAULT_NAME}"`, { stdio: 'pipe' });
    itemExists = true;
  } catch {
    // Item doesn't exist, will create
  }

  // Build field assignments as separate arguments (safe from shell injection)
  const fieldArgs = Object.entries(secrets).map(
    ([key, value]) => `${key}[password]=${value}`
  );

  try {
    let result;
    if (itemExists) {
      // Edit existing item using spawnSync (no shell, args passed directly)
      result = spawnSync('op', [
        'item', 'edit', ITEM_NAME,
        `--vault=${VAULT_NAME}`,
        ...fieldArgs
      ], { stdio: 'pipe', encoding: 'utf8' });
    } else {
      // Create new item using spawnSync (no shell, args passed directly)
      result = spawnSync('op', [
        'item', 'create',
        '--category=Secure Note',
        `--title=${ITEM_NAME}`,
        `--vault=${VAULT_NAME}`,
        ...fieldArgs
      ], { stdio: 'pipe', encoding: 'utf8' });
    }

    if (result.status !== 0) {
      throw new Error(result.stderr || 'Command failed');
    }

    console.log(`✅ ${itemExists ? 'Updated' : 'Created'} "${ITEM_NAME}" in 1Password`);
    console.log(`\n📦 Secrets saved to vault: ${VAULT_NAME}`);
    console.log('   Pull on other devices with: npm run env:pull\n');
  } catch (error) {
    console.error('❌ Failed to save secrets:', error.message);
    process.exit(1);
  }
}

/**
 * Main
 */
function main() {
  console.log('\n🔐 Pushing secrets to 1Password...\n');

  check1PasswordCLI();
  const vaultId = ensureVault();
  const secrets = readSecrets();
  saveSecrets(vaultId, secrets);
}

// Only run main() when executed directly, not when imported
import { fileURLToPath } from 'node:url';
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
