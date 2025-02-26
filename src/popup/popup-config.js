/**
 * We cannot access the config module's environment variables from the popup
 * so we hardcode the URLs here.
 */
const config = {
  // Development URLs (DANGER! DEBUGGING ONLY)
  // apiBaseUrl: "https://localhost:5001",
  authServerUrl: "https://localhost:3443",
  
  // Production URLs (Always change back before publishing)
  apiBaseUrl: "https://api.saypi.ai",
  //authServerUrl: "https://www.saypi.ai"
}; 