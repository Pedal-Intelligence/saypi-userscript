export const config = {
  appServerUrl: process.env.APP_SERVER_URL,
  apiServerUrl: process.env.API_SERVER_URL,
  authServerUrl: process.env.AUTH_SERVER_URL,
  authSessionLifetime: process.env.AUTH_SESSION_LIFETIME || '14d', // default to 14 days
  GA_MEASUREMENT_ID: process.env.GA_MEASUREMENT_ID,
  GA_API_SECRET: process.env.GA_API_SECRET,
  GA_ENDPOINT: process.env.GA_ENDPOINT,
};
