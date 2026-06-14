import { globalTeardown } from "./global-setup.ts";

// Playwright invokes the default export of the `globalTeardown` file. Delegate to
// the named `globalTeardown` in global-setup.ts so the mock HTTPS servers (started
// in globalSetup) are closed cleanly after the suite finishes.
export default async function (): Promise<void> {
  await globalTeardown();
}
