export function replaceEllipsisWithSpace(text) {
  return text.replace(/\.\.\. ([A-Z])/g, (match, p1) => ` ${p1.toLowerCase()}`);
}
