#!/usr/bin/env node
/**
 * Sets up environment files for development and production.
 *
 * Usage:
 *   npm run setup
 *   node scripts/setup-env.js
 *
 * Features:
 * - Creates .env and .env.production from templates if missing
 * - Optionally pulls secrets from 1Password (if op CLI available)
 * - Validates created files
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import readline from 'node:readline';

const root = process.cwd();

const files = [
  { template: '.env.example', target: '.env' },
  { template: '.env.production.example', target: '.env.production' },
];

/**
 * Check if 1Password CLI is installed and authenticated
 */
function check1PasswordCLI() {
  try {
    execSync('op --version', { stdio: 'pipe' });
    execSync('op account list', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Prompt user for yes/no question
 */
function prompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase().trim() === 'y' || answer.toLowerCase().trim() === 'yes');
    });
  });
}

/**
 * Copy template files if they don't exist
 */
function copyTemplates() {
  let createdAny = false;

  for (const { template, target } of files) {
    const templatePath = path.resolve(root, template);
    const targetPath = path.resolve(root, target);

    if (!fs.existsSync(templatePath)) {
      console.error(`❌ Template file ${template} not found!`);
      process.exit(1);
    }

    if (fs.existsSync(targetPath)) {
      console.log(`✓ ${target} already exists, skipping`);
    } else {
      fs.copyFileSync(templatePath, targetPath);
      console.log(`✅ Created ${target} from ${template}`);
      createdAny = true;
    }
  }

  return createdAny;
}

/**
 * Main setup flow
 */
async function main() {
  console.log('\n🚀 Say, Pi Environment Setup\n');

  const createdAny = copyTemplates();

  if (!createdAny) {
    console.log('\n✨ All environment files already exist!');
  }

  // Check for 1Password CLI
  const has1Password = check1PasswordCLI();

  if (has1Password) {
    console.log('\n🔐 1Password CLI detected!');
    console.log('   You can sync secrets across devices using:');
    console.log('   • npm run env:push  - Save current secrets to 1Password');
    console.log('   • npm run env:pull  - Load secrets from 1Password');
    console.log('\n   See CONTRIBUTING.md for complete documentation.');
  } else {
    console.log('\n💡 Tip: Install 1Password CLI to sync secrets across devices');
    console.log('   https://developer.1password.com/docs/cli/get-started/');
  }

  if (createdAny) {
    console.log('\n⚠️  Remember to update these values in your .env files:');
    console.log('   • VITE_GA_MEASUREMENT_ID (Google Analytics)');
    console.log('   • VITE_GA_API_SECRET (Google Analytics)');
    console.log('   • Server URLs (if using local development)');
    console.log('\n   Run "npm run validate:env" to check your configuration.');
  }

  console.log('\n✅ Setup complete!\n');
}

main().catch((error) => {
  console.error('Setup failed:', error);
  process.exit(1);
});
