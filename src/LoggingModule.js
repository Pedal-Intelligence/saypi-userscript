export function serializeStateValue(stateValue) {
  if (typeof stateValue === "string") {
    return stateValue;
  }

  return Object.keys(stateValue)
    .map((key) => `${key}:${serializeStateValue(stateValue[key])}`)
    .join(",");
}
