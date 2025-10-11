const env = (typeof import.meta !== "undefined" && import.meta.env)
  || (typeof process !== "undefined" ? process.env : {})
  || {};

export const config = {
  appServerUrl: env.VITE_APP_SERVER_URL ?? env.APP_SERVER_URL,
  apiServerUrl: env.VITE_API_SERVER_URL ?? env.API_SERVER_URL,
  authServerUrl: env.VITE_AUTH_SERVER_URL ?? env.AUTH_SERVER_URL,
  GA_MEASUREMENT_ID: env.VITE_GA_MEASUREMENT_ID ?? env.GA_MEASUREMENT_ID,
  GA_API_SECRET: env.VITE_GA_API_SECRET ?? env.GA_API_SECRET,
  GA_ENDPOINT: env.VITE_GA_ENDPOINT ?? env.GA_ENDPOINT,
  // Dev/debug flags
  keepSegments: env.VITE_KEEP_SEGMENTS ?? env.KEEP_SEGMENTS,
};
