/**
 * Pick a readable time-label colour for a segment of background colour `bgHex`,
 * choosing white or near-black by whichever yields higher WCAG contrast. The
 * muted telemetry palette has light members (sage, gold) where white labels read
 * poorly; this gives each segment a legible label without hardcoding per-colour.
 * Returns the colour plus a matching text-shadow (a soft dark halo behind white
 * text only — pointless behind dark text).
 */
export function readableSegmentLabel(bgHex: string): {
  color: string;
  textShadow: string;
} {
  const m = /^#?([0-9a-f]{6})$/i.exec(bgHex.trim());
  if (!m) return { color: "#fff", textShadow: "0 0 2px rgba(0,0,0,0.5)" };
  const int = parseInt(m[1], 16);
  const chan = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const L =
    0.2126 * chan((int >> 16) & 0xff) +
    0.7152 * chan((int >> 8) & 0xff) +
    0.0722 * chan(int & 0xff);
  const contrastWhite = 1.05 / (L + 0.05);
  const contrastBlack = (L + 0.05) / 0.05;
  return contrastBlack > contrastWhite
    ? { color: "#222", textShadow: "none" }
    : { color: "#fff", textShadow: "0 0 2px rgba(0,0,0,0.5)" };
}
