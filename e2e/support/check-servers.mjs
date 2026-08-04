// Local smoke check for the Layer 3 mock HTTPS servers.
// Starts both servers, fetches the Pi page over HTTPS, POSTs a tiny multipart
// /transcribe request, asserts the responses, then closes. Prints OK on success.
//
// Run: node e2e/support/check-servers.mjs
//
// Node >=22.18 strips TypeScript types by default, so importing the .ts
// mock-servers module directly works without a flag.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // self-signed cert: skip verification (local only)

import { startMockServers } from "./mock-servers.ts";

function assert(cond, msg) {
  if (!cond) {
    throw new Error(`ASSERT FAILED: ${msg}`);
  }
}

const servers = await startMockServers();
try {
  // 1) Pi page over HTTPS contains the mount point.
  const pageRes = await fetch(`https://127.0.0.1:${servers.piPort}/talk`);
  const html = await pageRes.text();
  assert(pageRes.status === 200, `Pi page status was ${pageRes.status}`);
  assert(html.includes("mock-mount"), "Pi page HTML missing 'mock-mount'");

  // 2) /transcribe returns shaped JSON with text + sequenceNumber.
  const boundary = "----saypiE2E";
  const body =
    `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="sequenceNumber"\r\n\r\n` +
    `7\r\n` +
    `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="audio"; filename="a.wav"\r\n` +
    `Content-Type: audio/wav\r\n\r\n` +
    `RIFFfake\r\n` +
    `--${boundary}--\r\n`;
  const txRes = await fetch(`https://127.0.0.1:${servers.apiPort}/transcribe`, {
    method: "POST",
    headers: { "content-type": `multipart/form-data; boundary=${boundary}` },
    body,
  });
  const json = await txRes.json();
  assert(txRes.status === 200, `/transcribe status was ${txRes.status}`);
  assert(typeof json.text === "string" && json.text.length > 0, "/transcribe response missing non-empty 'text'");
  assert(typeof json.sequenceNumber === "number", "/transcribe response missing numeric 'sequenceNumber'");
  assert(json.sequenceNumber === 7, `/transcribe should echo sequenceNumber 7, got ${json.sequenceNumber}`);
  assert(servers.transcribeHits() === 1, `expected 1 transcribe hit, got ${servers.transcribeHits()}`);
  assert(
    servers.lastAudioContentType() === "audio/wav",
    `expected audio/wav content-type, got ${servers.lastAudioContentType()}`,
  );

  // 3) The reset route zeroes the transcribe diagnostics (per-test isolation, #462).
  const resetRes = await fetch(`https://127.0.0.1:${servers.apiPort}/__transcribe-hits/reset`, {
    method: "POST",
  });
  assert(resetRes.status === 200, `reset status was ${resetRes.status}`);
  const afterReset = await (await fetch(`https://127.0.0.1:${servers.apiPort}/__transcribe-hits`)).json();
  assert(afterReset.hits === 0, `expected 0 hits after reset, got ${afterReset.hits}`);
  assert(
    afterReset.lastAudioContentType === null,
    `expected null content-type after reset, got ${afterReset.lastAudioContentType}`,
  );
  assert(servers.transcribeHits() === 0, `expected in-process hit counter 0 after reset, got ${servers.transcribeHits()}`);

  // 4) /voices serves a catalog shaped like the real one, with the three cases
  //    the Voices rail's design turns on: both tiers, a duplicate-named pair
  //    told apart only by language count, and a voice with no clip.
  const voicesRes = await fetch(`https://127.0.0.1:${servers.apiPort}/voices?app=pi`);
  const catalog = await voicesRes.json();
  assert(voicesRes.status === 200, `/voices status was ${voicesRes.status}`);
  assert(Array.isArray(catalog) && catalog.length > 0, "/voices should return a non-empty array");
  const tiers = new Set(catalog.map((v) => v.section));
  assert(tiers.has("hd") && tiers.has("everyday"), `/voices should span both tiers, got ${[...tiers]}`);
  const paolas = catalog.filter((v) => v.name === "Paola");
  assert(paolas.length === 2, `expected a duplicate-named pair, got ${paolas.length} Paolas`);
  assert(
    paolas[0].languages.length !== paolas[1].languages.length,
    "the duplicate-named pair must differ by language count (the #474 differentiator)",
  );
  assert(
    catalog.some((v) => !v.sample_url),
    "/voices should include a voice with no sample_url (the 'No sample yet' group)",
  );

  // 5) Every advertised sample_url serves real, decodable MP3 bytes. A stub body
  //    would leave every soundprint unmeasured and the rail silently untested.
  for (const voice of catalog.filter((v) => v.sample_url)) {
    const path = new URL(voice.sample_url).pathname;
    const clipRes = await fetch(`https://127.0.0.1:${servers.apiPort}${path}`);
    assert(clipRes.status === 200, `${path} status was ${clipRes.status}`);
    assert(
      clipRes.headers.get("content-type") === "audio/mpeg",
      `${path} content-type was ${clipRes.headers.get("content-type")}`,
    );
    const bytes = Buffer.from(await clipRes.arrayBuffer());
    assert(bytes.length > 8_000, `${path} returned only ${bytes.length} bytes`);
    assert(bytes.subarray(0, 3).toString("latin1") === "ID3", `${path} is not an MP3 (no ID3 header)`);
  }

  // 6) …and an unadvertised clip 404s rather than serving silence.
  const missingRes = await fetch(`https://127.0.0.1:${servers.apiPort}/voices/not-a-voice/sample`);
  assert(missingRes.status === 404, `unknown sample should 404, got ${missingRes.status}`);

  console.log("servers OK");
} finally {
  await servers.close();
}
