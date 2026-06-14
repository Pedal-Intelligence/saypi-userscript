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
    `EXCLUDE localhost`,
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
