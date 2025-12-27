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
 * This script:
 * 1. Reads sensitive values from .env and .env.production
 * 2. Creates/updates a secure note in 1Password with the secrets
 * 3. Uses the 'saypi-userscript-dev' vault (creates if missing)
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import dotenv from 'dotenv';

const root = process.cwd();
const VAULT_NAME = 'saypi-userscript-dev';
const ITEM_NAME = 'SayPi Dev Secrets';

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
 * Read environment files and extract secrets
 */
function readSecrets() {
  const secrets = {};

  // Keys we want to sync (sensitive values only)
  const keysToSync = [
    'VITE_GA_MEASUREMENT_ID',
    'VITE_GA_API_SECRET',
    'VITE_APP_SERVER_URL',
    'VITE_API_SERVER_URL',
    'VITE_AUTH_SERVER_URL',
    'VITE_GA_ENDPOINT',
  ];

  // Read .env
  const envPath = path.resolve(root, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const parsed = dotenv.parse(envContent);

    for (const key of keysToSync) {
      if (parsed[key]) {
        secrets[`dev_${key}`] = parsed[key];
      }
    }
  }

  // Read .env.production
  const prodEnvPath = path.resolve(root, '.env.production');
  if (fs.existsSync(prodEnvPath)) {
    const prodContent = fs.readFileSync(prodEnvPath, 'utf8');
    const parsed = dotenv.parse(prodContent);

    for (const key of keysToSync) {
      if (parsed[key]) {
        secrets[`prod_${key}`] = parsed[key];
      }
    }
  }

  return secrets;
}

/**
 * Save secrets to 1Password
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

  // Build field assignments
  const fields = Object.entries(secrets)
    .map(([key, value]) => `${key}[password]=${value}`)
    .join(' ');

  try {
    if (itemExists) {
      // Edit existing item
      const cmd = `op item edit "${ITEM_NAME}" --vault="${VAULT_NAME}" ${fields}`;
      execSync(cmd, { stdio: 'pipe' });
      console.log(`✅ Updated "${ITEM_NAME}" in 1Password`);
    } else {
      // Create new item
      const cmd = `op item create --category="Secure Note" --title="${ITEM_NAME}" --vault="${VAULT_NAME}" ${fields}`;
      execSync(cmd, { stdio: 'pipe' });
      console.log(`✅ Created "${ITEM_NAME}" in 1Password`);
    }

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

main();
