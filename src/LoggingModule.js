export function serializeStateValue(stateValue) {
  if (typeof stateValue === "string") {
    return stateValue;
  }

  return Object.keys(stateValue)
    .map((key) => `${key}:${serializeStateValue(stateValue[key])}`)
    .join(",");
}

const DEBUG = false; // Consider using config and .env to set the DEBUG flag

export const logger = {
  debug: (...args) => {
    if (DEBUG) {
      console.log("DEBUG:", ...args);
    }
  },
  info: (...args) => {
    console.log("INFO:", ...args);
  },
  error: (...args) => {
    console.error("ERROR:", ...args);
  },
};
