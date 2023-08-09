const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cheerio = require('cheerio');
const serveHandler = require('serve-handler');
const url = require('url');
const axios = require('axios');

const app = express();

app.get('/saypi.user.js', (req, res) => {
    serveHandler(req, res, {
        public: 'public',
    });
});

app.get('/static/js/literal.js', (req, res) => {
    serveHandler(req, res, {
        public: 'public',
    });
});

if (require.main === module) {
    // This means this file was run directly from command line, so start the server
    app.listen(process.env.PORT || 3000, () => {
        console.log(`App server listening on port ${process.env.PORT || 3000}`);
    });
} else {
    // This file was required from another module, so export the app without starting the server
    module.exports = app;
}
