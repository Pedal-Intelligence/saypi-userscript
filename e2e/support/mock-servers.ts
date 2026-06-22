import https from "node:https";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import selfsigned from "selfsigned";
import { buildTranscribeResponse } from "./transcribe-response.ts";

// selfsigned@5 exposes an async `generate`; resolve once at module load (top-level await, ESM).
const pems = await selfsigned.generate([{ name: "commonName", value: "saypi-e2e" }], { days: 1 });
const tls = { key: pems.private, cert: pems.cert };
const PI_PAGE = readFileSync(resolve(import.meta.dirname, "mock-pi-page.html"), "utf8");
const CLAUDE_PAGE = readFileSync(resolve(import.meta.dirname, "mock-claude-page.html"), "utf8");

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
    const page = host.includes("claude.ai") ? CLAUDE_PAGE : PI_PAGE;
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
