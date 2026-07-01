# Adding 60dB as a TTS/STT engine (alongside ElevenLabs)

This document specifies how 60dB (`api.60db.ai`) is integrated **consistently** with
the existing ElevenLabs/OpenAI/Pi voice engines.

## Design decision: server-side proxy

The extension **never** calls a TTS/STT vendor directly. ElevenLabs, OpenAI and
the Pi value‑tier voices are all proxied by the SayPi backend (`api.saypi.ai`);
the content script only ever speaks SayPi's own contract:

| Capability | Client call (unchanged) |
| --- | --- |
| List voices | `GET {apiServerUrl}/voices?app=<chatbot>` |
| Create + stream TTS | `POST {apiServerUrl}/speak/{uuid}/stream?voice_id=<id>&lang=<lang>&app=<app>` then `PUT {apiServerUrl}/speak/{uuid}/stream` per text chunk |
| Transcribe (STT) | `POST {apiServerUrl}/transcribe?app=<app>&language=<lang>` (multipart `file`) |

60dB is therefore added the **same way ElevenLabs and OpenAI were** (cf.
issue #215/#92): as another engine **behind** these endpoints. This keeps the
client maximally consistent — voices from every engine share one unified menu,
one billing model, and one audio pipeline. See
[`src/tts/SpeechModel.ts`](../src/tts/SpeechModel.ts) `audioProviders.retrieveProviderByEngine`.

```
content script ──SayPi contract──► api.saypi.ai ──proxies──► api.60db.ai
   (no change)                       (all 60dB work)            (vendor)
```

---

## Backend work (api.saypi.ai — not in this repo)

### 1. Voices: surface 60dB voices through `/voices`

Map each 60dB voice from `GET https://api.60db.ai/myvoices`
(auth: `Authorization: Bearer <60dB key>`) into SayPi's
`SpeechSynthesisVoiceRemote` shape. 60dB key fields:

| 60dB (`/myvoices`) | SayPi voice field |
| --- | --- |
| `voice_id` (UUID) | `id` / `voiceURI` (`{apiServerUrl}/voices/{id}`) |
| `name` | `name` |
| `labels.language` (ISO, e.g. `en`) | `lang` |
| `labels.language_name` | (display only) |
| `labels.gender` (`male`/`female`) | `gender` (`"M"`/`"F"`) |
| `labels.accent` (American/British/Indian/Neutral) | `accent` |
| `description` | `description` |
| — (set by SayPi) | `powered_by: "60dB"` **(exact literal — see client note)** |
| — (set by SayPi pricing) | `price_per_thousand_chars_in_usd`, `price_per_thousand_chars_in_credits` |
| — | `default: false`, `localService: false` |

60dB TTS pricing is `$0.00002/char` = **$0.02 / 1000 chars**; convert to your
credit basis and set `price_per_thousand_chars_in_credits` accordingly so the
unified menu shows a correct cost (the client multiplies chars × this field).

### 2. TTS: serve `/speak/{uuid}/stream` from 60dB

When a `voice_id` belongs to a 60dB voice, synthesise via 60dB. The SayPi
streaming contract (one initial `POST` with a `" "` start‑marker, then a `PUT`
per text chunk carrying a monotonic `sequenceNumber`, with `totalChunks` set on
the final chunk — see [`TextToSpeechService.ts`](../src/tts/TextToSpeechService.ts))
maps directly onto 60dB's **WebSocket context API**, which is the recommended
low‑latency path for incremental LLM output:

| SayPi stream lifecycle (client → SayPi) | 60dB WebSocket (SayPi → `wss://api.60db.ai/ws/tts?apiKey=…`) |
| --- | --- |
| `POST …/speak/{uuid}/stream` (open, `" "`) | `create_context` `{ context_id, voice_id, audio_config:{audio_encoding:"LINEAR16", sample_rate_hertz:24000}, speed, stability, similarity }` |
| `PUT …/speak/{uuid}/stream` chunk `{text, sequenceNumber}` | `send_text` `{ context_id, text }` (accumulates; up to 50 000 chars) |
| chunk with `totalChunks` (final) | `flush_context` then `close_context` |
| (audio streamed back to client) | server `audio_chunk` `{ audioContent: <base64> }` → decode → re‑emit on SayPi's existing binary audio stream |

`audioContent` for `LINEAR16`/`PCM` chunks concatenates directly. (Avoid
`OGG_OPUS` for incremental streaming — each chunk is a standalone Ogg file and
cannot be naively concatenated.)

Non‑WebSocket alternative: `POST https://api.60db.ai/tts-stream` (NDJSON, objects
`{type:"chunk"|"complete"|"error", result:{audioContent}}`) or the one‑shot
`POST /tts-synthesize` (`{audio_base64, sample_rate, …}`) for short, non‑streamed
utterances.

**Error mapping (keep the client's existing semantics):**
- 60dB insufficient credits / 402 → return **HTTP 429** on `/speak` so the client
  yields a `FailedSpeechUtterance(InsufficientCredit)` (see
  [`SpeechFailureReason`](../src/tts/SpeechFailureReason.ts) and `TextToSpeechService.createSpeech`).
- Upstream 5xx → non‑2xx so the client surfaces a generic synthesis failure.

### 3. STT: route `/transcribe` to 60dB

`POST {apiServerUrl}/transcribe` already uploads multipart audio plus `language`,
`app`, optional `prefer` and `removeFillerWords`
([`TranscriptionModule.ts`](../src/TranscriptionModule.ts)). Map to
`POST https://api.60db.ai/stt` (multipart `file`, `language` (`"auto"` for
detection), optional `diarize`, `context`, `keywords`, `return_timestamps`).
Map the 60dB response back to SayPi's transcription JSON — at minimum `text`
(the client reads `responseJson.text`). 60dB error codes map naturally:
`401→401`, `INSUFFICIENT_CREDITS/402→402`, `STT_*_RATE_LIMIT/429→429` (honour
`Retry-After`).

---

## Client work (this repo — done)

Because routing is server‑side, the client change is minimal and only ensures
60dB voices flow through the **unified voice menu** cleanly:

1. **Engine routing** — `src/tts/SpeechModel.ts`: added `case "60dB":` to
   `audioProviders.retrieveProviderByEngine`, mapping it to the SayPi provider
   (same branch as `ElevenLabs`/`OpenAI`). Without this, 60dB voices would still
   work via the default fallback but log an "unrecognised provider" warning.
2. **Engine logo** — `public/icons/logos/60db.svg`: the menu builds the logo path
   as `icons/logos/<powered_by lowercased>.svg`
   ([`TTSControlsModule.createTtsLogo`](../src/tts/TTSControlsModule.ts)), so the
   `powered_by` literal **must** lowercase to `60db` to match this file. A
   placeholder wordmark is committed — **replace with the official brand SVG.**
3. **Test** — `test/tts/AudioProviders.spec.ts`: asserts `"60dB"` → SayPi with no
   warning.

Everything else (voice name/lang/gender/accent/description, per‑char price, cost
display, audio playback, keep‑alive) is data‑driven from the `/voices` response
and needs no client change.

### Contract invariant

The single coupling between client and backend is the **`powered_by` literal**.
It must be exactly `"60dB"` everywhere the backend emits it, because:
- the routing `switch` matches it case‑sensitively, and
- the logo filename is its lowercase form (`60db.svg`).

If you prefer a different literal, change all three of: the backend `/voices`
output, the `case` in `SpeechModel.ts`, and the SVG filename.
