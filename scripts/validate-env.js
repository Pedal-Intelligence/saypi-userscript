#!/usr/bin/env node
/**
 * Validates required environment variables before running builds or local dev.
 *
 * Usage:
 *   node scripts/validate-env.js --file .env --env development
 *   node scripts/validate-env.js --file .env.production --env production
 */

import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import dotenv from 'dotenv';

const { values } = parseArgs({
  options: {
    file: { type: 'string', short: 'f' },
    env: { type: 'string', short: 'e' },
  },
});

const envFile = values.file ?? '.env';
const envType = (values.env ?? (envFile.includes('production') ? 'production' : 'development')).toLowerCase();
const supportedEnvs = new Set(['development', 'production']);

if (!supportedEnvs.has(envType)) {
  console.error(`Unknown environment "${envType}". Expected one of: development, production.`);
  process.exit(1);
}

const root = process.cwd();
const envPath = path.resolve(root, envFile);
const templateLookup = envType === 'production' ? '.env.production.example' : '.env.example';

if (!fs.existsSync(envPath)) {
  console.error(`\nEnvironment validation failed: ${envFile} is missing.`);
  console.error(`→ Copy ${templateLookup} to ${envFile} and fill in the required values.`);
  process.exit(1);
}

let envContent = '';
try {
  envContent = fs.readFileSync(envPath, 'utf8');
} catch (error) {
  console.error(`\nFailed to read ${envFile}: ${error.message}`);
  process.exit(1);
}

const parsed = dotenv.parse(envContent);

const trim = (value) => (typeof value === 'string' ? value.trim() : value);

const errors = [];
const warnings = [];

const parseUrl = (value, varName) => {
  try {
    const url = new URL(value);
    return url;
  } catch (error) {
    errors.push(`• ${varName} must be a valid URL (http or https). Received "${value}".`);
    return null;
  }
};

const expectUrl = (key, { requireHttps = false, allowHttpLocalhost = false } = {}) => {
  const raw = trim(parsed[key]);
  if (!raw) {
    errors.push(`• ${key} is missing. Add it to ${envFile} (see ${templateLookup} for guidance).`);
    return;
  }
  const url = parseUrl(raw, key);
  if (!url) {
    return;
  }
  if (!['http:', 'https:'].includes(url.protocol)) {
    errors.push(`• ${key} must use http or https. Received "${url.protocol}".`);
    return;
  }
  if (url.protocol === 'https:') {
    return; // always acceptable
  }
  const isLocalhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  if (requireHttps && !isLocalhost) {
    errors.push(`• ${key} must use https in ${envType} builds. Update it to an https URL.`);
    return;
  }
  if (!allowHttpLocalhost || !isLocalhost) {
    errors.push(`• ${key} only allows http for localhost. Update the URL or switch to https.`);
  }
};

const expectNonPlaceholder = (key, { minLength = 1, disallow = [] } = {}) => {
  const raw = trim(parsed[key]);
  if (!raw) {
    errors.push(`• ${key} is missing. Add it to ${envFile} (see ${templateLookup} for guidance).`);
    return;
  }
  if (raw.length < minLength) {
    errors.push(`• ${key} must be at least ${minLength} characters long.`);
    return;
  }
  const upper = raw.toUpperCase();
  if (disallow.some((invalid) => upper === invalid.toUpperCase())) {
    errors.push(`• ${key} still uses a placeholder value. Update it with the real credential.`);
  }
};

const expectRegex = (key, regex, message) => {
  const raw = trim(parsed[key]);
  if (!raw) {
    errors.push(`• ${key} is missing. Add it to ${envFile} (see ${templateLookup} for guidance).`);
    return;
  }
  if (!regex.test(raw)) {
    errors.push(`• ${key} ${message}. Received "${raw}".`);
  }
};

const expectBoolean = (key, { recommended = null, hardError = false } = {}) => {
  const value = parsed[key];
  if (typeof value === 'undefined') {
    return; // optional flag
  }
  const normalized = value.trim().toLowerCase();
  if (!['true', 'false'].includes(normalized)) {
    const msg = `• ${key} must be "true" or "false" (received "${value}").`;
    if (hardError) {
      errors.push(msg);
    } else {
      warnings.push(msg);
    }
    return;
  }
  if (recommended !== null && normalized !== recommended) {
    warnings.push(`• ${key} is set to "${normalized}". For ${envType} builds the recommended value is "${recommended}".`);
  }
};

const expectInteger = (key, { min = 0 } = {}) => {
  const value = parsed[key];
  if (typeof value === 'undefined' || value.trim() === '') {
    return; // optional
  }
  const numeric = Number(value);
  if (!Number.isInteger(numeric) || numeric < min) {
    errors.push(`• ${key} must be an integer greater than or equal to ${min}. Received "${value}".`);
  }
};

// Required URLs
expectUrl('APP_SERVER_URL', { requireHttps: envType === 'production', allowHttpLocalhost: true });
expectUrl('API_SERVER_URL', { requireHttps: envType === 'production', allowHttpLocalhost: true });
expectUrl('AUTH_SERVER_URL', { requireHttps: envType === 'production', allowHttpLocalhost: true });

// Analytics configuration
expectRegex('GA_MEASUREMENT_ID', /^G-[A-Z0-9]{4,}$/i, 'must match the format G-XXXXXXXXXX');
expectNonPlaceholder('GA_API_SECRET', { minLength: 8, disallow: ['XXXXXXXXXX', 'REPLACE_ME'] });

const gaEndpoint = trim(parsed.GA_ENDPOINT);
if (!gaEndpoint) {
  errors.push(`• GA_ENDPOINT is missing. Add it to ${envFile} (see ${templateLookup} for guidance).`);
} else {
  const url = parseUrl(gaEndpoint, 'GA_ENDPOINT');
  if (url) {
    if (!['http:', 'https:'].includes(url.protocol)) {
      errors.push(`• GA_ENDPOINT must use http or https. Received "${url.protocol}".`);
    }
    const host = url.hostname.toLowerCase();
    if (!host.endsWith('google-analytics.com')) {
      errors.push('• GA_ENDPOINT must point to a google-analytics.com endpoint.');
    }
  }
}

// Optional flags
expectBoolean('KEEP_SEGMENTS', {
  recommended: envType === 'production' ? 'false' : null,
});
expectBoolean('DEBUG_LOGS');
expectInteger('AUTH_SESSION_LIFETIME', { min: 60 });

if (errors.length) {
  console.error(`\nEnvironment validation failed for ${envFile}:`);
  errors.forEach((line) => console.error(line));
  if (warnings.length) {
    console.error('\nWarnings:');
    warnings.forEach((line) => console.error(line));
  }
  console.error(`\nFix the issues above and re-run the command. Refer to ${templateLookup} for expected keys.`);
  process.exit(1);
}

if (warnings.length) {
  console.warn(`\nEnvironment validation warnings for ${envFile}:`);
  warnings.forEach((line) => console.warn(line));
}

console.log(`Environment file ${envFile} passed validation.`);
