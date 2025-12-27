#!/usr/bin/env node
/**
 * Pull environment secrets from 1Password to local .env files.
 *
 * Usage:
 *   npm run env:pull
 *   node scripts/1password-pull.js
 *
 * Prerequisites:
 *   - 1Password CLI installed: https://developer.1password.com/docs/cli/get-started/
 *   - Authenticated with: op signin
 *   - Secrets previously pushed with: npm run env:push
 *
 * Configuration (optional environment variables):
 *   - OP_VAULT_NAME: Override default vault name (default: 'saypi-userscript-dev')
 *   - OP_ITEM_NAME: Override default item name (default: 'SayPi Dev Secrets')
 *
 * This script:
 * 1. Fetches secrets from 1Password item
 * 2. Updates .env and .env.production with fetched values
 * 3. Preserves comments and non-secret values in existing files
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync, spawnSync } from 'node:child_process';

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
 * Fetch secrets from 1Password using spawnSync for safety
 */
function fetchSecrets() {
  try {
    const result = spawnSync('op', [
      'item', 'get', ITEM_NAME,
      `--vault=${VAULT_NAME}`,
      '--format=json'
    ], { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });

    if (result.status !== 0) {
      throw new Error(result.stderr || 'Command failed');
    }

    const item = JSON.parse(result.stdout);

    const secrets = { dev: {}, prod: {} };

    // Extract fields
    if (item.fields) {
      for (const field of item.fields) {
        if (field.label && field.value) {
          const label = field.label;

          if (label.startsWith('dev_')) {
            const key = label.replace('dev_', '');
            secrets.dev[key] = field.value;
          } else if (label.startsWith('prod_')) {
            const key = label.replace('prod_', '');
            secrets.prod[key] = field.value;
          }
        }
      }
    }

    return secrets;
  } catch (error) {
    console.error(`❌ Failed to fetch secrets from 1Password.`);
    console.error(`   Make sure you've run "npm run env:push" first.`);
    console.error(`   Error: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Update env file content with secrets while preserving structure.
 * Exported for testing.
 * @param {string} content - Existing file content (empty string if new file)
 * @param {Object} secrets - Key-value pairs to update
 * @returns {string} - Updated content
 */
export function updateEnvContent(content, secrets) {
  let result = content;

  for (const [key, value] of Object.entries(secrets)) {
    const regex = new RegExp(`^${key}=.*$`, 'm');

    if (regex.test(result)) {
      // Update existing key
      result = result.replace(regex, `${key}=${value}`);
    } else {
      // Add new key at the end
      result = result.trimEnd() + `\n${key}=${value}\n`;
    }
  }

  return result;
}

/**
 * Update .env file with secrets while preserving structure
 */
function updateEnvFile(filePath, secrets) {
  let content = '';

  if (fs.existsSync(filePath)) {
    content = fs.readFileSync(filePath, 'utf8');
  } else {
    console.log(`   Creating new file: ${path.basename(filePath)}`);
  }

  const updated = updateEnvContent(content, secrets);
  fs.writeFileSync(filePath, updated, 'utf8');
}

/**
 * Main
 */
function main() {
  console.log('\n🔐 Pulling secrets from 1Password...\n');

  check1PasswordCLI();
  const secrets = fetchSecrets();

  const devCount = Object.keys(secrets.dev).length;
  const prodCount = Object.keys(secrets.prod).length;

  if (devCount === 0 && prodCount === 0) {
    console.error('❌ No secrets found in 1Password item');
    console.error('   Run "npm run env:push" to save secrets first');
    process.exit(1);
  }

  // Update .env
  if (devCount > 0) {
    const envPath = path.resolve(root, '.env');
    updateEnvFile(envPath, secrets.dev);
    console.log(`✅ Updated .env with ${devCount} secrets`);
  }

  // Update .env.production
  if (prodCount > 0) {
    const prodPath = path.resolve(root, '.env.production');
    updateEnvFile(prodPath, secrets.prod);
    console.log(`✅ Updated .env.production with ${prodCount} secrets`);
  }

  console.log('\n🎉 Secrets pulled successfully!\n');
  console.log('   Run "npm run validate:env" to verify configuration.\n');
}

// Only run main() when executed directly, not when imported
import { fileURLToPath } from 'node:url';
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
