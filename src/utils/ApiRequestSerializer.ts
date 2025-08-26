/**
 * Utilities for serializing and deserializing API request data for structured clone
 * transmission between content scripts and background service worker.
 * 
 * This handles FormData and Blob objects that cannot be directly passed through
 * chrome.runtime.sendMessage due to structured clone limitations.
 */
import { config } from '../ConfigModule.js';

export interface SerializedFormData {
  type: 'FormData';
  entries: Array<[string, string | SerializedBlob]>;
}

export interface SerializedBlob {
  type: 'Blob';
  data: ArrayBuffer | string; // base64 when encoding === 'base64'
  mimeType: string;
  fileName?: string; // preserved when the original Blob was a File
  encoding?: 'raw' | 'base64';
}

export interface SerializedApiRequest {
  url: string;
  options: {
    method?: string;
    headers?: Record<string, string>;
    body?: string | SerializedFormData | SerializedBlob | ArrayBuffer;
    credentials?: RequestCredentials;
    signal?: never; // AbortSignal cannot be serialized
    responseType?: 'json' | 'text' | 'arrayBuffer';
  };
}

function isBlobLike(value: any): value is Blob {
  return (
    value &&
    typeof value === 'object' &&
    typeof (value as any).arrayBuffer === 'function' &&
    typeof (value as any).size === 'number' &&
    typeof (value as any).type === 'string'
  );
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  // btoa handles binary string ➜ base64
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Serializes a Blob for transmission via structured clone
 */
export async function serializeBlob(blob: Blob): Promise<SerializedBlob> {
  // Prefer base64 encoding for maximal structured-clone compatibility across contexts
  const arrayBuffer = await blob.arrayBuffer();
  const base64 = arrayBufferToBase64(arrayBuffer);
  // Preserve filename when available (File extends Blob)
  const maybeFileName = (typeof File !== 'undefined' && (blob as any) && (blob as any).name)
    ? (blob as File).name
    : (typeof (blob as any).name === 'string' ? (blob as any).name : undefined);
  return {
    type: 'Blob',
    data: base64,
    mimeType: blob.type,
    fileName: maybeFileName,
    encoding: 'base64'
  };
}

/**
 * Deserializes a Blob from structured clone data
 */
export function deserializeBlob(serialized: SerializedBlob): Blob {
  let bytes: ArrayBuffer;
  if (serialized.encoding === 'base64' && typeof serialized.data === 'string') {
    bytes = base64ToArrayBuffer(serialized.data);
  } else {
    bytes = serialized.data as ArrayBuffer;
  }
  return new Blob([bytes], { type: serialized.mimeType });
}

/**
 * Serializes FormData for transmission via structured clone
 */
export async function serializeFormData(formData: FormData): Promise<SerializedFormData> {
  const entries: Array<[string, string | SerializedBlob]> = [];
  
  // Use forEach for widest cross-browser compat (Firefox sometimes returns a
  // non-iterable iterator for entries())
  const tasks: Array<Promise<void>> = [];
  formData.forEach((value, key) => {
    if (isBlobLike(value)) {
      tasks.push(
        (async () => {
          const serialized = await serializeBlob(value as Blob);
          entries.push([key, serialized]);
        })()
      );
    } else {
      entries.push([key, String(value)]);
    }
  });
  await Promise.all(tasks);
  
  return {
    type: 'FormData',
    entries
  };
}

/**
 * Deserializes FormData from structured clone data
 */
export function deserializeFormData(serialized: SerializedFormData): FormData {
  const formData = new FormData();
  
  for (const [key, value] of serialized.entries) {
    if (typeof value === 'object' && value !== null && 'type' in value && value.type === 'Blob') {
      const ser = value as SerializedBlob;
      const blob = deserializeBlob(ser);
      // Preserve filename when present
      formData.append(key, blob, ser.fileName);
    } else {
      formData.append(key, value as string);
    }
  }
  
  return formData;
}

/**
 * Serializes an API request for transmission via structured clone
 */
export async function serializeApiRequest(
  url: string,
  options: RequestInit = {}
): Promise<SerializedApiRequest> {
  const serializedOptions: SerializedApiRequest['options'] = {
    method: options.method,
    credentials: options.credentials
  };

  // Serialize headers into a simple record regardless of init shape
  if (options.headers) {
    const headersRecord: Record<string, string> = {};
    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => {
        headersRecord[key] = value;
      });
    } else if (Array.isArray(options.headers)) {
      for (const [key, value] of options.headers as Array<[string, string]>) {
        headersRecord[key] = value;
      }
    } else {
      Object.assign(headersRecord, options.headers as Record<string, string>);
    }
    serializedOptions.headers = headersRecord;
  }

  // Serialize body
  if (options.body !== undefined && options.body !== null) {
    const bodyAny: any = options.body as any;
    if (bodyAny instanceof FormData) {
      serializedOptions.body = await serializeFormData(bodyAny);
    } else if (bodyAny instanceof Blob) {
      serializedOptions.body = await serializeBlob(bodyAny);
    } else if (typeof ArrayBuffer !== 'undefined' && bodyAny instanceof ArrayBuffer) {
      // ArrayBuffer is structured-clone friendly
      serializedOptions.body = bodyAny;
    } else if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView(bodyAny)) {
      // TypedArray/DataView → copy into an ArrayBuffer of exact length
      const view = bodyAny as ArrayBufferView;
      const buf = new ArrayBuffer(view.byteLength);
      new Uint8Array(buf).set(new Uint8Array(view.buffer, view.byteOffset, view.byteLength));
      serializedOptions.body = buf;
    } else {
      // String and other JSON-compatible types
      serializedOptions.body = bodyAny as string;
    }
  }

  // Pass through optional responseType hint if provided by caller
  if ((options as any).responseType) {
    (serializedOptions as any).responseType = (options as any).responseType;
  }

  return {
    url,
    options: serializedOptions
  };
}

/**
 * Deserializes an API request from structured clone data
 */
export function deserializeApiRequest(
  serialized: SerializedApiRequest
): { url: string; options: RequestInit } {
  const options: RequestInit = {
    method: serialized.options.method,
    credentials: serialized.options.credentials
  };

  // Deserialize headers
  if (serialized.options.headers) {
    options.headers = new Headers(serialized.options.headers);
  }

  // Deserialize body
  if (serialized.options.body !== undefined && serialized.options.body !== null) {
    const bodyAny: any = serialized.options.body as any;
    if (typeof bodyAny === 'object') {
      if ((bodyAny as SerializedFormData).type === 'FormData') {
        options.body = deserializeFormData(bodyAny as SerializedFormData);
      } else if ((bodyAny as SerializedBlob).type === 'Blob') {
        options.body = deserializeBlob(bodyAny as SerializedBlob);
      } else if (typeof ArrayBuffer !== 'undefined' && bodyAny instanceof ArrayBuffer) {
        options.body = bodyAny as ArrayBuffer;
      } else {
        // Unknown object type – leave undefined
      }
    } else {
      options.body = bodyAny as string;
    }
  }

  return { url: serialized.url, options };
}

/**
 * Checks if a URL should be routed through the background service worker
 * to bypass CSP restrictions.
 */
export function shouldRouteViaBackground(url: string): boolean {
  try {
    const hostname = new URL(url).hostname;
    const allowed = getAllowedSayPiHosts();
    return allowed.has(hostname);
  } catch {
    return false;
  }
}

function getAllowedSayPiHosts(): Set<string> {
  const hosts = new Set<string>(['api.saypi.ai', 'www.saypi.ai']);
  try {
    if (config?.apiServerUrl) {
      hosts.add(new URL(config.apiServerUrl).hostname);
    }
  } catch {}
  try {
    if (config?.authServerUrl) {
      hosts.add(new URL(config.authServerUrl).hostname);
    }
  } catch {}
  return hosts;
}