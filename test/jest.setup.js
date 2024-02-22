import { TextEncoder, TextDecoder } from "util";

// Mock environment variables
process.env.GA_MEASUREMENT_ID = "mock-measurement-id";
process.env.GA_API_SECRET = "mock-api-secret";
process.env.GA_ENDPOINT = "https://www.google-analytics.com/mp/collect";

// text-encoding is not supported in JSDOM, so we need to polyfill it
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
