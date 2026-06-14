import https from "node:https";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import selfsigned from "selfsigned";
import { buildTranscribeResponse } from "./transcribe-response.ts";

// selfsigned@5 exposes an async `generate`; resolve once at module load (top-level await, ESM).
const pems = await selfsigned.generate([{ name: "commonName", value: "saypi-e2e" }], { days: 1 });
const tls = { key: pems.private, cert: pems.cert };
const PAGE = readFileSync(resolve(import.meta.dirname, "mock-pi-page.html"), "utf8");

export interface MockServers {
  piPort: number;
  apiPort: number;
  transcribeHits: () => number;
  close: () => Promise<void>;
}

function extractSequenceNumber(body: Buffer): number {
  // tolerant scan of the multipart form for the sequenceNumber field
  const m = body.toString("latin1").match(/name="sequenceNumber"\r?\n\r?\n(\d+)/);
  return m ? Number(m[1]) : 1;
}

export async function startMockServers(): Promise<MockServers> {
  let hits = 0;

  const piServer = https.createServer(tls, (_req, res) => {
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(PAGE);
  });

  const apiServer = https.createServer(tls, (req, res) => {
    if (req.method === "POST" && req.url && req.url.startsWith("/transcribe")) {
      const chunks: Buffer[] = [];
      req.on("data", (c) => chunks.push(c));
      req.on("end", () => {
        hits++;
        const seq = extractSequenceNumber(Buffer.concat(chunks));
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
    if (req.method === "POST" && req.url && req.url.startsWith("/merge")) {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify({ combined_transcript: "" }));
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
    close: async () => {
      await new Promise((r) => piServer.close(() => r(null)));
      await new Promise((r) => apiServer.close(() => r(null)));
    },
  };
}
