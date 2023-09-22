const fs = require("fs");
const https = require("https");
const express = require("express");
const path = require("path");

// Read the key and certificate files
const privateKey = fs.readFileSync(
  path.join(__dirname, "certificates/localhost-key.pem"),
  "utf8"
);
const certificate = fs.readFileSync(
  path.join(__dirname, "certificates/localhost.pem"),
  "utf8"
);

// Create a credentials object
const credentials = { key: privateKey, cert: certificate };

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://pi.ai");
  next();
});

app.use("/", express.static(path.join(__dirname, "public")));

// Create an HTTPS service with the Express app
const httpsServer = https.createServer(credentials, app);

if (require.main === module) {
  // This means this file was run directly from command line, so start the server
  httpsServer.listen(process.env.PORT || 4443, "0.0.0.0", () => {
    console.log(`App server listening on port ${process.env.PORT || 4443}`);
  });
} else {
  // This file was required from another module, so export the app without starting the server
  module.exports = app;
}
