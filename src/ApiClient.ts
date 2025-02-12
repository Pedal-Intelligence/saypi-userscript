import { jwtManager } from './JwtManager';

interface ApiRequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

export async function callApi(
  url: string,
  options: ApiRequestOptions = {}
): Promise<Response> {
  const headers = new Headers(options.headers);
  
  // If authentication is required or a token exists, add it
  const authHeader = jwtManager.getAuthHeader();
  if (authHeader) {
    headers.set('Authorization', authHeader);
  }

  const requestOptions: RequestInit = {
    ...options,
    headers
  };

  const response = await fetch(url, requestOptions);

  // If we get a 401 and have a token, try to refresh and retry once
  if (response.status === 401 && authHeader) {
    await jwtManager.refresh(true);
    
    // If we got a new token after refresh, retry the request
    const newAuthHeader = jwtManager.getAuthHeader();
    if (newAuthHeader) {
      headers.set('Authorization', newAuthHeader);
      return fetch(url, requestOptions);
    }
  }

  return response;
} 