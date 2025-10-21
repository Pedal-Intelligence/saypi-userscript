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
const resolvedValues = new Map();

const resolveEnvValue = (key, { legacyKey } = {}) => {
  if (resolvedValues.has(key)) {
    return resolvedValues.get(key);
  }

  const modern = trim(parsed[key]);
  if (modern) {
    const entry = { value: modern, sourceKey: key, legacyUsed: false };
    resolvedValues.set(key, entry);
    return entry;
  }

  if (legacyKey) {
    const legacy = trim(parsed[legacyKey]);
    if (legacy) {
      const entry = { value: legacy, sourceKey: legacyKey, legacyUsed: true };
      resolvedValues.set(key, entry);
      warnings.push(`• ${legacyKey} is deprecated. Rename it to ${key} in ${envFile}.`);
      return entry;
    }
  }

  const entry = { value: undefined, sourceKey: key, legacyUsed: false };
  resolvedValues.set(key, entry);
  return entry;
};

const parseUrl = (value, varName) => {
  try {
    const url = new URL(value);
    return url;
  } catch (error) {
    errors.push(`• ${varName} must be a valid URL (http or https). Received "${value}".`);
    return null;
  }
};

const expectUrl = (key, { legacyKey, requireHttps = false, allowHttpLocalhost = false } = {}) => {
  const { value } = resolveEnvValue(key, { legacyKey });
  if (!value) {
    errors.push(`• ${key} is missing. Add it to ${envFile} (see ${templateLookup} for guidance).`);
    return;
  }
  const url = parseUrl(value, key);
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

const expectNonPlaceholder = (key, { legacyKey, minLength = 1, disallow = [] } = {}) => {
  const { value } = resolveEnvValue(key, { legacyKey });
  if (!value) {
    errors.push(`• ${key} is missing. Add it to ${envFile} (see ${templateLookup} for guidance).`);
    return;
  }
  if (value.length < minLength) {
    errors.push(`• ${key} must be at least ${minLength} characters long.`);
    return;
  }
  const upper = value.toUpperCase();
  if (disallow.some((invalid) => upper === invalid.toUpperCase())) {
    errors.push(`• ${key} still uses a placeholder value. Update it with the real credential.`);
  }
};

const expectRegex = (key, regex, message, { legacyKey } = {}) => {
  const { value } = resolveEnvValue(key, { legacyKey });
  if (!value) {
    errors.push(`• ${key} is missing. Add it to ${envFile} (see ${templateLookup} for guidance).`);
    return;
  }
  if (!regex.test(value)) {
    errors.push(`• ${key} ${message}. Received "${value}".`);
  }
};

const expectBoolean = (key, { legacyKey, recommended = null, hardError = false } = {}) => {
  const { value } = resolveEnvValue(key, { legacyKey });
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

const expectInteger = (key, { legacyKey, min = 0 } = {}) => {
  const { value } = resolveEnvValue(key, { legacyKey });
  if (typeof value === 'undefined' || value.trim() === '') {
    return; // optional
  }
  const numeric = Number(value);
  if (!Number.isInteger(numeric) || numeric < min) {
    errors.push(`• ${key} must be an integer greater than or equal to ${min}. Received "${value}".`);
  }
};

// Required URLs
expectUrl('VITE_APP_SERVER_URL', {
  legacyKey: 'APP_SERVER_URL',
  requireHttps: envType === 'production',
  allowHttpLocalhost: true,
});
expectUrl('VITE_API_SERVER_URL', {
  legacyKey: 'API_SERVER_URL',
  requireHttps: envType === 'production',
  allowHttpLocalhost: true,
});
expectUrl('VITE_AUTH_SERVER_URL', {
  legacyKey: 'AUTH_SERVER_URL',
  requireHttps: envType === 'production',
  allowHttpLocalhost: true,
});

// Analytics configuration
expectRegex(
  'VITE_GA_MEASUREMENT_ID',
  /^G-[A-Z0-9]{4,}$/i,
  'must match the format G-XXXXXXXXXX',
  { legacyKey: 'GA_MEASUREMENT_ID' }
);
expectNonPlaceholder('VITE_GA_API_SECRET', {
  legacyKey: 'GA_API_SECRET',
  minLength: 8,
  disallow: ['XXXXXXXXXX', 'REPLACE_ME'],
});

const { value: gaEndpoint } = resolveEnvValue('VITE_GA_ENDPOINT', { legacyKey: 'GA_ENDPOINT' });
if (!gaEndpoint) {
  errors.push(`• VITE_GA_ENDPOINT is missing. Add it to ${envFile} (see ${templateLookup} for guidance).`);
} else {
  const url = parseUrl(gaEndpoint, 'VITE_GA_ENDPOINT');
  if (url) {
    if (!['http:', 'https:'].includes(url.protocol)) {
      errors.push(`• VITE_GA_ENDPOINT must use http or https. Received "${url.protocol}".`);
    }
    const host = url.hostname.toLowerCase();
    if (!host.endsWith('google-analytics.com')) {
      errors.push('• VITE_GA_ENDPOINT must point to a google-analytics.com endpoint.');
    }
  }
}

// Optional flags
expectBoolean('VITE_KEEP_SEGMENTS', {
  legacyKey: 'KEEP_SEGMENTS',
  recommended: envType === 'production' ? 'false' : null,
});
expectBoolean('VITE_DEBUG_LOGS', { legacyKey: 'DEBUG_LOGS' });
expectInteger('VITE_AUTH_SESSION_LIFETIME', {
  legacyKey: 'AUTH_SESSION_LIFETIME',
  min: 60,
});

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
