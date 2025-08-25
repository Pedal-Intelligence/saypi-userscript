/**
 * Utilities for serializing and deserializing API request data for structured clone
 * transmission between content scripts and background service worker.
 * 
 * This handles FormData and Blob objects that cannot be directly passed through
 * chrome.runtime.sendMessage due to structured clone limitations.
 */

export interface SerializedFormData {
  type: 'FormData';
  entries: Array<[string, string | SerializedBlob]>;
}

export interface SerializedBlob {
  type: 'Blob';
  data: ArrayBuffer;
  mimeType: string;
}

export interface SerializedApiRequest {
  url: string;
  options: {
    method?: string;
    headers?: Record<string, string>;
    body?: string | SerializedFormData | SerializedBlob;
    credentials?: RequestCredentials;
    signal?: never; // AbortSignal cannot be serialized
  };
}

/**
 * Serializes a Blob for transmission via structured clone
 */
export async function serializeBlob(blob: Blob): Promise<SerializedBlob> {
  const arrayBuffer = await blob.arrayBuffer();
  return {
    type: 'Blob',
    data: arrayBuffer,
    mimeType: blob.type
  };
}

/**
 * Deserializes a Blob from structured clone data
 */
export function deserializeBlob(serialized: SerializedBlob): Blob {
  return new Blob([serialized.data], { type: serialized.mimeType });
}

/**
 * Serializes FormData for transmission via structured clone
 */
export async function serializeFormData(formData: FormData): Promise<SerializedFormData> {
  const entries: Array<[string, string | SerializedBlob]> = [];
  
  for (const [key, value] of formData.entries()) {
    if (value instanceof Blob) {
      entries.push([key, await serializeBlob(value)]);
    } else {
      entries.push([key, value.toString()]);
    }
  }
  
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
      formData.append(key, deserializeBlob(value as SerializedBlob));
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

  // Serialize headers
  if (options.headers) {
    if (options.headers instanceof Headers) {
      serializedOptions.headers = {};
      options.headers.forEach((value, key) => {
        serializedOptions.headers![key] = value;
      });
    } else {
      serializedOptions.headers = { ...options.headers } as Record<string, string>;
    }
  }

  // Serialize body
  if (options.body) {
    if (options.body instanceof FormData) {
      serializedOptions.body = await serializeFormData(options.body);
    } else if (options.body instanceof Blob) {
      serializedOptions.body = await serializeBlob(options.body);
    } else {
      // String, ArrayBuffer, etc. can be passed directly
      serializedOptions.body = options.body as string;
    }
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
  if (serialized.options.body) {
    if (typeof serialized.options.body === 'object') {
      if (serialized.options.body.type === 'FormData') {
        options.body = deserializeFormData(serialized.options.body);
      } else if (serialized.options.body.type === 'Blob') {
        options.body = deserializeBlob(serialized.options.body);
      }
    } else {
      options.body = serialized.options.body;
    }
  }

  return { url: serialized.url, options };
}

/**
 * Checks if a URL should be routed through the background service worker
 * to bypass CSP restrictions.
 */
export function shouldRouteViaBackground(url: string): boolean {
  return url.includes('api.saypi.ai') || url.includes('www.saypi.ai');
}