export function serializeStateValue(stateValue) {
  if (typeof stateValue === "string") {
    return stateValue;
  }

  return Object.keys(stateValue)
    .map((key) => `${key}:${serializeStateValue(stateValue[key])}`)
    .join(",");
}

export const logger = {
  debug: (...args) => {
    console.debug("DEBUG:", ...args);
  },
  info: (...args) => {
    console.log("INFO:", ...args);
  },
  error: (...args) => {
    console.error("ERROR:", ...args);
  },
};
