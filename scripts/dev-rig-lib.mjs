// Pure, side-effect-free helpers for the dev-rig launcher (scripts/dev-rig.mjs).
// No node-API calls here so they can be unit-tested under Vitest/jsdom.

// Server-URL presets, mirrored from scripts/switch-env.js.
const PRESETS = {
  local: {
    VITE_API_SERVER_URL: "https://127.0.0.1:5001",
    VITE_AUTH_SERVER_URL: "http://localhost:3000",
    VITE_APP_SERVER_URL: "https://app.saypi.ai",
  },
  remote: {
    VITE_API_SERVER_URL: "https://api.saypi.ai",
    VITE_AUTH_SERVER_URL: "https://www.saypi.ai",
    VITE_APP_SERVER_URL: "https://app.saypi.ai",
  },
};

const ALIASES = {
  VITE_API_SERVER_URL: ["API_SERVER_URL"],
  VITE_AUTH_SERVER_URL: ["AUTH_SERVER_URL"],
  VITE_APP_SERVER_URL: ["APP_SERVER_URL"],
};

/**
 * Parse .env contents into a flat key→value map; ignores comments + inline
 * comments and strips matched surrounding quotes (standard dotenv `KEY="value"`),
 * so a quoted server URL still classifies correctly instead of looking "custom".
 */
export function parseEnvVars(content) {
  const vars = {};
  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    const hash = value.indexOf("#");
    if (hash !== -1) value = value.slice(0, hash).trim();
    if (
      value.length >= 2 &&
      ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'")))
    ) {
      value = value.slice(1, -1);
    }
    vars[key] = value;
  }
  return vars;
}

function resolveValue(vars, key) {
  if (Object.prototype.hasOwnProperty.call(vars, key)) return vars[key];
  for (const alias of ALIASES[key] ?? []) {
    if (Object.prototype.hasOwnProperty.call(vars, alias)) return vars[alias];
  }
  return undefined;
}

/** Which server preset does this .env match? @returns {"local"|"remote"|"custom"} */
export function parseEnvMode(content) {
  const vars = parseEnvVars(content);
  for (const [mode, preset] of Object.entries(PRESETS)) {
    const matches = Object.entries(preset).every(
      ([key, value]) => resolveValue(vars, key) === value,
    );
    if (matches) return mode;
  }
  return "custom";
}

/**
 * PIDs of THIS repo's `wxt` dev processes, from `ps -ax -o pid=,command=` output.
 * Matches the repo's wxt binary path so other projects' dev servers are never killed.
 */
export function parseWxtPids(psOutput, repoPath) {
  const needle = `${repoPath}/node_modules/.bin/wxt`;
  const pids = [];
  for (const line of psOutput.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const match = /^(\d+)\s+(.*)$/.exec(trimmed);
    if (!match) continue;
    const [, pid, command] = match;
    if (command.includes(needle)) pids.push(Number(pid));
  }
  return pids;
}
