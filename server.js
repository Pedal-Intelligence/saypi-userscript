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

const __dirname = path.dirname(new URL(import.meta.url).pathname);

app.use("/", express.static(path.join(__dirname, "public")));

let tls = false;
if (!isProduction) {
  const certDir = process.env.CERT_DIR || path.join(__dirname, "certificates");
  const privateKeyPath = path.join(certDir, "localhost-key.pem");
  const certificatePath = path.join(certDir, "localhost.pem");

  if (fs.existsSync(privateKeyPath) && fs.existsSync(certificatePath)) {
    const privateKey = fs.readFileSync(privateKeyPath, "utf8");
    const certificate = fs.readFileSync(certificatePath, "utf8");
    const credentials = { key: privateKey, cert: certificate };
    server = https.createServer(credentials, app);
    tls = true;
  } else {
    console.log(
      "HTTPS certificates not found. Set CERT_DIR env var to use HTTPS in development environments. Falling back to HTTP."
    );
    server = http.createServer(app);
  }
} else {
  server = http.createServer(app);
}

if (import.meta.url.endsWith("/server.js")) {
  const port = process.env.PORT || (tls ? 4443 : 8080);
  server.listen(port, "0.0.0.0", () => {
    console.log(`App server listening on port ${port}`);
  });
} else {
  console.log("saypi-userscript/server.js is being imported");
}
