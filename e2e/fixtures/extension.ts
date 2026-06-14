import { test as base, chromium, type BrowserContext, type Worker } from "@playwright/test";
import { resolve } from "node:path";
import { buildLaunchArgs } from "./launch-args";

const EXT_DIR = resolve(import.meta.dirname, "../../.output/chrome-mv3-dev");
const WAV = resolve(import.meta.dirname, "audio/speech-16k-mono.wav");

export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
  serviceWorker: Worker;
}>({
  context: async ({}, use) => {
    const piPort = Number(process.env.SAYPI_E2E_PI_PORT);
    const apiPort = Number(process.env.SAYPI_E2E_API_PORT);
    const context = await chromium.launchPersistentContext("", {
      channel: "chromium",
      args: buildLaunchArgs({ extensionDir: EXT_DIR, piPort, apiPort, wavPath: WAV }),
      ignoreHTTPSErrors: true,
    });
    await use(context);
    await context.close();
  },
  serviceWorker: async ({ context }, use) => {
    let [sw] = context.serviceWorkers();
    if (!sw) sw = await context.waitForEvent("serviceworker");
    await use(sw);
  },
  extensionId: async ({ serviceWorker }, use) => {
    await use(serviceWorker.url().split("/")[2]);
  },
});
export const expect = test.expect;
