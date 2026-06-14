export interface LaunchArgsOptions {
  extensionDir: string;
  piPort: number;
  apiPort: number;
  wavPath: string;
}

/** Build the Chrome launch args for the Layer 3 harness. See spec facts #5-#8. */
export function buildLaunchArgs(o: LaunchArgsOptions): string[] {
  const hostRules = [
    `MAP pi.ai 127.0.0.1:${o.piPort}`,
    `MAP api.saypi.ai 127.0.0.1:${o.apiPort}`,
    `MAP www.saypi.ai 127.0.0.1:${o.apiPort}`,
    `MAP app.saypi.ai 127.0.0.1:${o.apiPort}`,
    `MAP www.google-analytics.com 127.0.0.1:${o.apiPort}`,
    `MAP google-analytics.com 127.0.0.1:${o.apiPort}`,
    `EXCLUDE localhost`,
    // Fail CLOSED: any host not explicitly mapped above resolves to nothing, so a
    // future spec (or stray bundle/Chrome request) that touches an unmapped
    // endpoint errors loudly instead of silently reaching the real internet. Must
    // be LAST — host-resolver-rules apply the first matching rule.
    `MAP * ~NOTFOUND`,
  ].join(",");
  return [
    `--disable-extensions-except=${o.extensionDir}`,
    `--load-extension=${o.extensionDir}`,
    `--host-resolver-rules=${hostRules}`,
    "--ignore-certificate-errors",
    "--allow-insecure-localhost",
    "--use-fake-device-for-media-stream",
    "--use-fake-ui-for-media-stream",
    `--use-file-for-fake-audio-capture=${o.wavPath}`,
    "--headless=new",
    "--no-sandbox",
    "--autoplay-policy=no-user-gesture-required",
  ];
}
