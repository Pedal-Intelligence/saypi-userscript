import https from "node:https";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import selfsigned from "selfsigned";
import { buildTranscribeResponse } from "./transcribe-response.ts";
import {
  MOCK_VOICE_CATALOG,
  SAMPLE_CLIP_BY_VOICE,
  type SampleClip,
} from "./voice-catalog.ts";

// selfsigned@5 exposes an async `generate`; resolve once at module load (top-level await, ESM).
const pems = await selfsigned.generate([{ name: "commonName", value: "saypi-e2e" }], { days: 1 });
const tls = { key: pems.private, cert: pems.cert };
const PI_PAGE = readFileSync(resolve(import.meta.dirname, "mock-pi-page.html"), "utf8");
const CLAUDE_PAGE = readFileSync(resolve(import.meta.dirname, "mock-claude-page.html"), "utf8");
const HEY_PI_PAGE = readFileSync(resolve(import.meta.dirname, "mock-hey-pi-page.html"), "utf8");

// The three committed preview clips (~52 KB all told), read once. They must be
// REAL decodable audio, not a stub: the Voices rail measures every voice by
// fetching its clip and decoding it, so a placeholder body would leave the rail
// printless and silently un-testable. See e2e/fixtures/voices/README.md.
const CLIP_DIR = resolve(import.meta.dirname, "../fixtures/voices");
const SAMPLE_CLIPS: Record<SampleClip, Buffer> = {
  onyx: readFileSync(resolve(CLIP_DIR, "onyx.mp3")),
  alloy: readFileSync(resolve(CLIP_DIR, "alloy.mp3")),
  addison: readFileSync(resolve(CLIP_DIR, "addison.mp3")),
};

const VOICES_BY_ID = new Map(MOCK_VOICE_CATALOG.map((voice) => [voice.id, voice]));

export interface MockServers {
  piPort: number;
  apiPort: number;
  transcribeHits: () => number;
  lastAudioContentType: () => string | null;
  close: () => Promise<void>;
}

function extractSequenceNumber(body: Buffer): number {
  // tolerant scan of the multipart form for the sequenceNumber field
  const m = body.toString("latin1").match(/name="sequenceNumber"\r?\n\r?\n(\d+)/);
  return m ? Number(m[1]) : 1;
}

function extractAudioContentType(body: Buffer): string | null {
  // tolerant scan of the multipart form for the audio part's Content-Type
  // (proves whether the client uploaded WebM/Opus or fell back to PCM WAV — #414)
  const m = body
    .toString("latin1")
    .match(/name="audio";\s*filename="[^"]*"\r?\nContent-Type:\s*([^\r\n]+)/i);
  return m ? m[1].trim() : null;
}

export async function startMockServers(): Promise<MockServers> {
  let hits = 0;
  let lastAudioContentType: string | null = null;

  // One page server backs both decorated hosts; the Host header picks the page.
  // claude.ai and pi.ai both resolve here via --host-resolver-rules, and the
  // content script injects per the manifest match for whichever URL is loaded.
  const piServer = https.createServer(tls, (req, res) => {
    const host = (req.headers.host ?? "").toLowerCase();
    // hey.pi.ai first: it is a pi.ai SUBdomain, so the fallthrough would hand it
    // the chat-shaped Pi mock and quietly weaken the chat-adjacent spec (#559).
    // This ordering protects hey.pi.ai ONLY — the claude branch below is a
    // substring test, so a future `hey.claude.ai` mapping would fall into the
    // Claude chat mock and needs its own branch here (and its own MAP).
    const page = host.startsWith("hey.pi.ai")
      ? HEY_PI_PAGE
      : host.includes("claude.ai")
        ? CLAUDE_PAGE
        : PI_PAGE;
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(page);
  });

  const apiServer = https.createServer(tls, (req, res) => {
    // Diagnostic route: how many times has /transcribe been hit so far. The
    // browser fetches the /transcribe upload from the extension SW/offscreen
    // context (not the page), so page.on("response") can't see it — specs read
    // this counter via the SW instead. CORS-open so the SW fetch succeeds.
    if (req.method === "GET" && req.url && req.url.startsWith("/__transcribe-hits")) {
      res.writeHead(200, {
        "content-type": "application/json",
        "access-control-allow-origin": "*",
      });
      res.end(JSON.stringify({ hits, lastAudioContentType }));
      return;
    }
    // Reset route: zero the transcribe diagnostics. The Playwright context
    // fixture POSTs here BEFORE launching each test's browser, so no spec's
    // hits/content-type assertion can be satisfied by another test's (or an
    // earlier CI retry's) traffic — isolation by construction (#462).
    if (req.method === "POST" && req.url && req.url.startsWith("/__transcribe-hits/reset")) {
      hits = 0;
      lastAudioContentType = null;
      res.writeHead(200, {
        "content-type": "application/json",
        "access-control-allow-origin": "*",
      });
      res.end(JSON.stringify({ hits, lastAudioContentType }));
      return;
    }
    // --- the voice catalog, and the clips it advertises ---------------------
    //
    // Both arrive HERE and nowhere else. `/voices` is fetched by the extension's
    // SERVICE WORKER (`shouldRouteViaBackground` proxies every api.saypi.ai call
    // through the background worker to escape host-page CSP), so a Playwright
    // page route would never see it; the clips are fetched by the settings page
    // itself, twice over — once by `VoicePrintLoader` to measure the soundprint
    // and once by the `<audio>` element to play it. One mock server is the only
    // interception point that covers all three.
    if (req.method === "GET" && req.url && req.url.startsWith("/voices")) {
      // Parse rather than string-match: the real `sample_url` carries a `?v=`
      // cache-buster, and `/voices` itself carries `?app=<host>`.
      const path = new URL(req.url, "https://api.saypi.ai").pathname;
      const sample = /^\/voices\/([^/]+)\/sample$/.exec(path);
      if (sample) {
        const clip = SAMPLE_CLIP_BY_VOICE[decodeURIComponent(sample[1])];
        if (clip) {
          res.writeHead(200, {
            "content-type": "audio/mpeg",
            "content-length": SAMPLE_CLIPS[clip].length,
            // Production caches previews for a year (design §3: every preview is
            // free). Each test gets a fresh browser profile, so this is faithful
            // without leaking state between specs.
            "cache-control": "public, max-age=31536000, immutable",
            "access-control-allow-origin": "*",
          });
          res.end(SAMPLE_CLIPS[clip]);
          return;
        }
        // A clip nobody advertises: fail loudly rather than serving silence.
        res.writeHead(404).end();
        return;
      }
      const single = /^\/voices\/([^/]+)$/.exec(path);
      if (single) {
        // GET /voices/<id> — how a STORED voice preference is re-hydrated
        // (TextToSpeechService.getVoiceById). A spec that seeds a current voice
        // depends on this; without it the preference reads back as null and the
        // rail has no voice "in use".
        const voice = VOICES_BY_ID.get(decodeURIComponent(single[1]));
        if (!voice) {
          res.writeHead(404, { "access-control-allow-origin": "*" }).end();
          return;
        }
        res.writeHead(200, {
          "content-type": "application/json",
          "access-control-allow-origin": "*",
        });
        res.end(JSON.stringify(voice));
        return;
      }
      if (path === "/voices") {
        // Host-agnostic on purpose: the studio asks per host (`?app=pi` /
        // `?app=claude`) and the two hosts differ in what they DO with the
        // catalog (Claude seats an in-chat menu, Pi has none), not in what they
        // are offered. One catalog keeps that difference attributable to the
        // client, which is where it lives.
        res.writeHead(200, {
          "content-type": "application/json",
          "access-control-allow-origin": "*",
          "access-control-allow-credentials": "true",
        });
        res.end(JSON.stringify(MOCK_VOICE_CATALOG));
        return;
      }
      res.writeHead(404, { "access-control-allow-origin": "*" }).end();
      return;
    }
    if (req.method === "POST" && req.url && req.url.startsWith("/transcribe")) {
      const chunks: Buffer[] = [];
      req.on("data", (c) => chunks.push(c));
      req.on("end", () => {
        hits++;
        const body = Buffer.concat(chunks);
        lastAudioContentType = extractAudioContentType(body) ?? lastAudioContentType;
        const seq = extractSequenceNumber(body);
        const payload = JSON.stringify(buildTranscribeResponse({ sequenceNumber: seq }));
        res.writeHead(200, {
          "content-type": "application/json",
          "access-control-allow-origin": "*",
          "access-control-allow-credentials": "true",
        });
        res.end(payload);
      });
      return;
    }
    // Catch-all: absorb any other POST (e.g. the GA beacon to /debug/mp/collect)
    // so the harness stays hermetic. Drain the body, then return an empty 200.
    if (req.method === "POST") {
      req.on("data", () => {});
      req.on("end", () => {
        res.writeHead(200, { "content-type": "application/json" });
        res.end("{}");
      });
      return;
    }
    res.writeHead(404).end();
  });

  await new Promise<void>((r) => piServer.listen(0, "127.0.0.1", r));
  await new Promise<void>((r) => apiServer.listen(0, "127.0.0.1", r));

  return {
    piPort: (piServer.address() as import("node:net").AddressInfo).port,
    apiPort: (apiServer.address() as import("node:net").AddressInfo).port,
    transcribeHits: () => hits,
    lastAudioContentType: () => lastAudioContentType,
    close: async () => {
      await new Promise((r) => piServer.close(() => r(null)));
      await new Promise((r) => apiServer.close(() => r(null)));
    },
  };
}
