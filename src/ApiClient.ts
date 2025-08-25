import { getJwtManager } from './JwtManager';
import EventBus from './events/EventBus';
import { serializeApiRequest, shouldRouteViaBackground } from './utils/ApiRequestSerializer';

interface ApiRequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

// Listen for authentication status changes
EventBus.on('saypi:auth:status-changed', (isAuthenticated) => {
  console.log('ApiClient detected auth status change:', isAuthenticated);
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
      console.warn('Background API request failed, falling back to direct fetch:', error);
      // Fall through to direct fetch as fallback
    }
  }

  // Direct fetch for non-SayPi URLs or when background routing fails
  return await callApiDirect(url, options);
}

/**
 * Routes API request through background service worker to bypass CSP restrictions
 */
async function callApiViaBackground(
  url: string,
  options: ApiRequestOptions = {}
): Promise<Response> {
  console.debug(`Routing API request via background to: ${url}`, { 
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
        
        const reconstructedResponse = new Response(responseData.body, {
          status: responseData.status,
          statusText: responseData.statusText,
          headers: responseHeaders
        });

        // Copy ok property
        Object.defineProperty(reconstructedResponse, 'ok', {
          value: responseData.ok,
          writable: false
        });

        resolve(reconstructedResponse);
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
    console.debug('Token is about to expire, refreshing...');
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

  console.debug(`Making API request to: ${url}`, { 
    method: options.method || 'GET',
    hasAuthHeader: !!authHeader,
    isLocalDev
  });

  const response = await fetch(url, requestOptions);

  // If we get a 401 or 403 in response to an authenticated request, try to refresh the token and retry once
  if ((response.status === 401 || response.status === 403) && authHeader) {
    console.debug('Received 401/403, attempting to refresh token...');
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
      
      console.debug('Token refreshed, retrying request with new token...');
      return fetch(url, newRequestOptions);
    } else {
      console.warn('Token refresh failed, returning original response');
    }
  }

  return response;
} 