import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { URL } from 'url'; // Standard URL parsing

// Determine the project root directory
const projectRoot = process.cwd();

// Determine which .env file to load based on NODE_ENV
// NODE_ENV will be 'production' if set by the npm script (e.g., for prebuild)
// Otherwise, it defaults to loading '.env' for development.
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
const envPath = path.resolve(projectRoot, envFile);

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log(`Loaded environment variables from ${envFile}`);
} else {
  console.warn(`Warning: Environment file ${envPath} not found. Using default or already set system environment variables.`);
}

const manifestPath = path.resolve(projectRoot, 'manifest.json');
let manifest;

try {
  const manifestContent = fs.readFileSync(manifestPath, 'utf-8');
  manifest = JSON.parse(manifestContent);
} catch (error) {
  console.error(`Error reading or parsing manifest.json from ${manifestPath}: ${error.message}`);
  process.exit(1);
}

const apiServerUrl = process.env.API_SERVER_URL;
const authServerUrl = process.env.AUTH_SERVER_URL;

if (!apiServerUrl) {
  console.error(
    `Error: API_SERVER_URL is not defined. Please ensure it is set in ${envFile} or your system environment.`
  );
  // Exiting because API_SERVER_URL is likely critical
  process.exit(1);
}
if (!authServerUrl) {
  // Warning for AUTH_SERVER_URL, as it might be optional or handled differently.
  // If it's mandatory, change this to console.error and process.exit(1).
  console.warn(
    `Warning: AUTH_SERVER_URL is not defined. It will not be added to host_permissions. Ensure it's set in ${envFile} if required.`
  );
}

const formatUrlForHostPermission = (urlInput) => {
  if (!urlInput || typeof urlInput !== 'string') {
    console.warn(`Invalid or empty URL input for host permission: '${urlInput}'. Skipping.`);
    return null;
  }
  try {
    const urlObj = new URL(urlInput);
    // Host permissions match the origin and /* covers all paths.
    return `${urlObj.protocol}//${urlObj.hostname}${urlObj.port ? ':' + urlObj.port : ''}/*`;
  } catch (e) {
    console.error(`Invalid URL format for host permission: "${urlInput}". It should be a full URL (e.g., http://localhost:3000 or https://api.example.com). Error: ${e.message}`);
    process.exit(1); // Critical error if URL formatting fails
  }
};

const permissionsToAdd = [];
const formattedApiUrl = apiServerUrl ? formatUrlForHostPermission(apiServerUrl) : null;
const formattedAuthUrl = authServerUrl ? formatUrlForHostPermission(authServerUrl) : null;

if (formattedApiUrl) {
  permissionsToAdd.push(formattedApiUrl);
}
if (formattedAuthUrl) {
  permissionsToAdd.push(formattedAuthUrl);
}

// Build host_permissions array exclusively from environment URLs
manifest.host_permissions = permissionsToAdd.filter(Boolean);

// Write the updated manifest
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
console.log(`manifest.json host_permissions set to: ${manifest.host_permissions.join(', ')}`); 