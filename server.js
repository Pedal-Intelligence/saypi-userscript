import fs from "fs";
import http from "http";
import https from "https";
import express from "express";
import path from "path";

const isProduction = process.env.NODE_ENV === "production";
let server;

const app = express();
export default app;

// Allowed origins for CORS
const allowedOrigins = [
  "https://pi.ai",
  "https://www.saypi.ai",
  "https://app.saypi.ai",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  next();
});

app.use("/", express.static(path.join(import.meta.url, "public")));

if (!isProduction) {
  const privateKey = fs.readFileSync(
    path.join(import.meta.url, "certificates/localhost-key.pem"),
    "utf8"
  );
  const certificate = fs.readFileSync(
    path.join(import.meta.url, "certificates/localhost.pem"),
    "utf8"
  );

  const credentials = { key: privateKey, cert: certificate };
  server = https.createServer(credentials, app);
} else {
  server = http.createServer(app);
}

if (import.meta.main) {
  const port = process.env.PORT || (isProduction ? 80 : 4443);
  server.listen(port, "0.0.0.0", () => {
    console.log(`App server listening on port ${port}`);
  });
}
