import { getJwtManager } from './JwtManager';
import EventBus from './events/EventBus';
import { serializeApiRequest, shouldRouteViaBackground } from './utils/ApiRequestSerializer';
import { logger } from './LoggingModule.js';

interface ApiRequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

// Listen for authentication status changes
EventBus.on('saypi:auth:status-changed', (isAuthenticated: boolean) => {
  logger.debug('ApiClient detected auth status change:', isAuthenticated);
});

export async function callApi(
  url: string,
  options: ApiRequestOptions = {}
): Promise<Response> {
  // Check if this request should be routed through background to bypass CSP
  if (shouldRouteViaBackground(url)) {
    try {
      return await callApiViaBackground(url, options);
    } catch (error) {
      logger.warn('Background API request failed, falling back to direct fetch:', error);
      // Fall through to direct fetch as fallback
    }
  }

  // Direct fetch for non-SayPi URLs or when background routing fails
  return await callApiDirect(url, options);
}

/**
 * Statuses the Fetch spec defines as carrying no body — constructing a Response with
 * any body for one of these throws a TypeError.
 */
function isNullBodyStatus(status: number): boolean {
  return status === 204 || status === 205 || status === 304;
}

/**
 * Routes API request through background service worker to bypass CSP restrictions
 */
async function callApiViaBackground(
  url: string,
  options: ApiRequestOptions = {}
): Promise<Response> {
  logger.debug(`Routing API request via background to: ${url}`, { 
    method: options.method || 'GET'
  });

  // Serialize the request for transmission to background
  const serializedRequest = await serializeApiRequest(url, options);

  // Send to background service worker
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        type: 'API_REQUEST',
        ...serializedRequest
      },
      (response) => {
        // Anything thrown in here escapes the Promise executor, leaving the caller
        // hung forever rather than failing — so the whole body is guarded (#557).
        try {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
            return;
          }

          if (!response.success) {
            const error = new Error(response.error || 'Background API request failed');
            error.name = response.name || 'ApiError';
            reject(error);
            return;
          }

          // Reconstruct Response object from background response
          const responseData = response.response;
          const responseHeaders = new Headers(responseData.headers);

          // Respect desired responseType when reconstructing the Response body
          const desiredType = (options as any)?.responseType as ('json'|'text'|'arrayBuffer'|undefined);
          let bodyInit: BodyInit | null = null;
          if (isNullBodyStatus(responseData.status)) {
            // 204/205/304 carry no body by definition, and the Response constructor
            // rejects ANY body for them — including "" and "null" (#557).
            bodyInit = null;
          } else if (desiredType === 'json') {
            if (typeof responseData.body === 'string') {
              bodyInit = responseData.body as string;
            } else {
              bodyInit = JSON.stringify(responseData.body ?? null);
            }
            if (!responseHeaders.has('content-type')) {
              responseHeaders.set('content-type', 'application/json');
            }
          } else if (desiredType === 'arrayBuffer') {
            bodyInit = responseData.body as ArrayBuffer;
          } else {
            bodyInit = typeof responseData.body === 'string'
              ? (responseData.body as string)
              : String(responseData.body ?? '');
          }

          const reconstructedResponse = new Response(bodyInit, {
            status: responseData.status,
            statusText: responseData.statusText,
            headers: responseHeaders
          });

          resolve(reconstructedResponse);
        } catch (error) {
          reject(error instanceof Error ? error : new Error(String(error)));
        }
      }
    );
  });
}

/**
 * Direct fetch implementation (original logic)
 */
async function callApiDirect(
  url: string,
  options: ApiRequestOptions = {}
): Promise<Response> {
  const headers = new Headers(options.headers);

  // Get the fully initialized JWT manager
  const jwtManager = await getJwtManager();

  // preemptively refresh the token if it's about to expire
  if (jwtManager.isTokenExpired()) {
    logger.debug('Token is about to expire, refreshing...');
    await jwtManager.refresh();
  }
  
  // If authentication is required or a token exists, add it
  const authHeader = jwtManager.getAuthHeader();
  // if no auth header is set here and this is an authenticated endpoint, expect a 401 response
  if (authHeader) {
    headers.set('Authorization', authHeader);
  }

  // For local development, ensure credentials are included
  const isLocalDev = url.includes('localhost');
  const credentials = isLocalDev ? 'include' : (options.credentials || 'same-origin');

  const requestOptions: RequestInit = {
    ...options,
    headers,
    credentials
  };

  logger.debug(`Making API request to: ${url}`, { 
    method: options.method || 'GET',
    hasAuthHeader: !!authHeader,
    isLocalDev
  });

  const response = await fetch(url, requestOptions);

  // If we get a 401 or 403 in response to an authenticated request, try to refresh the token and retry once
  if ((response.status === 401 || response.status === 403) && authHeader) {
    logger.debug('Received 401/403, attempting to refresh token...');
    await jwtManager.refresh(true);
    
    // If we got a new token after refresh, retry the request
    const newAuthHeader = jwtManager.getAuthHeader();
    if (newAuthHeader) {
      // Create a new headers object with the updated auth header
      const newHeaders = new Headers(options.headers);
      newHeaders.set('Authorization', newAuthHeader);
      
      // Create new request options with the updated headers
      const newRequestOptions: RequestInit = {
        ...options,
        headers: newHeaders,
        credentials
      };
      
      logger.debug('Token refreshed, retrying request with new token...');
      return fetch(url, newRequestOptions);
    } else {
      logger.warn('Token refresh failed, returning original response');
    }
  }

  return response;
} 
