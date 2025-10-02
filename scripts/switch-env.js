#!/usr/bin/env node
/**
 * Environment switcher for SayPi development
 * 
 * Easily switch between local and remote server configurations.
 * 
 * Usage:
 *   node scripts/switch-env.js local
 *   node scripts/switch-env.js remote
 *   node scripts/switch-env.js status
 */

import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';

const { positionals, values } = parseArgs({
  allowPositionals: true,
  options: {
    help: { type: 'boolean', short: 'h' },
  },
});

const mode = positionals[0];
const root = process.cwd();
const envPath = path.resolve(root, '.env');

// Environment presets
const presets = {
  local: {
    name: 'Local Development',
    config: {
      APP_SERVER_URL: 'https://app.saypi.ai',
      API_SERVER_URL: 'https://127.0.0.1:5001',
      AUTH_SERVER_URL: 'http://localhost:3000',
    }
  },
  remote: {
    name: 'Remote/Production',
    config: {
      APP_SERVER_URL: 'https://app.saypi.ai',
      API_SERVER_URL: 'https://api.saypi.ai',
      AUTH_SERVER_URL: 'https://www.saypi.ai',
    }
  }
};

function readEnvFile() {
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env file not found. Please create it first from .env.example');
    process.exit(1);
  }
  return fs.readFileSync(envPath, 'utf8');
}

function writeEnvFile(content) {
  fs.writeFileSync(envPath, content, 'utf8');
}

function getCurrentConfig() {
  const content = readEnvFile();
  const lines = content.split('\n');
  const config = {};
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        let value = valueParts.join('=').trim();
        // Remove inline comments
        const commentIndex = value.indexOf('#');
        if (commentIndex !== -1) {
          value = value.substring(0, commentIndex).trim();
        }
        config[key.trim()] = value;
      }
    }
  }
  
  return config;
}

function detectCurrentMode() {
  const current = getCurrentConfig();
  
  for (const [modeName, preset] of Object.entries(presets)) {
    const matches = Object.entries(preset.config).every(([key, value]) => 
      current[key] === value
    );
    if (matches) {
      return modeName;
    }
  }
  
  return 'custom';
}

function updateEnvFile(targetMode) {
  const preset = presets[targetMode];
  if (!preset) {
    console.error(`❌ Unknown mode: ${targetMode}. Available modes: ${Object.keys(presets).join(', ')}`);
    process.exit(1);
  }

  let content = readEnvFile();
  
  // Update each configuration value and clean up inline comments
  for (const [key, value] of Object.entries(preset.config)) {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    if (content.match(regex)) {
      // Replace existing value, removing any inline comments
      content = content.replace(regex, `${key}=${value}`);
    } else {
      // Add new value (shouldn't happen with current setup, but good to be safe)
      content += `\n${key}=${value}`;
    }
  }
  
  writeEnvFile(content);
  console.log(`✅ Switched to ${preset.name} configuration`);
  console.log(`   API: ${preset.config.API_SERVER_URL}`);
  console.log(`   Auth: ${preset.config.AUTH_SERVER_URL}`);
}

function showStatus() {
  const currentMode = detectCurrentMode();
  const current = getCurrentConfig();
  
  console.log('📊 Current Environment Configuration:');
  console.log('');
  
  if (currentMode !== 'custom') {
    const preset = presets[currentMode];
    console.log(`🎯 Mode: ${preset.name} (${currentMode})`);
  } else {
    console.log('🎯 Mode: Custom configuration');
  }
  
  console.log('');
  console.log('🔗 Server URLs:');
  console.log(`   APP:  ${current.APP_SERVER_URL || 'not set'}`);
  console.log(`   API:  ${current.API_SERVER_URL || 'not set'}`);
  console.log(`   Auth: ${current.AUTH_SERVER_URL || 'not set'}`);
  
  console.log('');
  console.log('💡 Available modes:');
  for (const [modeName, preset] of Object.entries(presets)) {
    const indicator = currentMode === modeName ? '👉' : '  ';
    console.log(`${indicator} ${modeName.padEnd(8)} - ${preset.name}`);
    console.log(`     API: ${preset.config.API_SERVER_URL}`);
    console.log(`     Auth: ${preset.config.AUTH_SERVER_URL}`);
  }
}

function toggleMode() {
  const currentMode = detectCurrentMode();
  
  if (currentMode === 'custom') {
    console.log('⚠️  Cannot toggle from custom configuration.');
    console.log('   Current settings don\'t match any preset.');
    console.log('   Use "npm run switch local" or "npm run switch remote" to set a specific mode.');
    return;
  }
  
  // Toggle between local and remote
  const targetMode = currentMode === 'local' ? 'remote' : 'local';
  const currentPreset = presets[currentMode];
  const targetPreset = presets[targetMode];
  
  console.log(`🔄 Toggling from ${currentPreset.name} to ${targetPreset.name}...`);
  updateEnvFile(targetMode);
}

function showHelp() {
  console.log('🔄 SayPi Environment Switcher');
  console.log('');
  console.log('Usage:');
  console.log('  npm run switch         - 🚀 Toggle between local and remote (recommended!)');
  console.log('  npm run switch local   - Switch to local development servers');
  console.log('  npm run switch remote  - Switch to remote/production servers');
  console.log('  npm run switch status  - Show current configuration');
  console.log('  npm run switch help    - Show this help message');
  console.log('');
  console.log('Available modes:');
  for (const [modeName, preset] of Object.entries(presets)) {
    console.log(`  ${modeName.padEnd(8)} - ${preset.name}`);
  }
  console.log('');
  console.log('💡 Pro tip: Just run "npm run switch" to toggle between environments!');
}

// Main execution
if (values.help || mode === 'help' || mode === '--help') {
  showHelp();
} else if (!mode) {
  // No arguments - toggle mode
  toggleMode();
} else if (mode === 'status') {
  showStatus();
} else if (presets[mode]) {
  updateEnvFile(mode);
} else {
  console.error(`❌ Unknown command: ${mode}`);
  console.error('');
  showHelp();
  process.exit(1);
}
