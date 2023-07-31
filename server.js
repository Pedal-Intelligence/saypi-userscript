const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const serveHandler = require('serve-handler');

const app = express();

// Handle '/saypi.user.js' specifically
app.get('/saypi.user.js', (req, res) => {
    serveHandler(req, res, {
        public: 'public', // directory to serve
    });
});

app.get(['/', '/index.html'], createProxyMiddleware({
    target: 'https://saypi.my.canva.site/',
    changeOrigin: true,
    followRedirects: true
}));

// Check if it's not a local resource
app.get('/static/*', (req, res) => {
    serveHandler(req, res, {
        public: 'public', // directory to serve
    });
});

// Proxy any other request to Canva
app.use('*', createProxyMiddleware({
    target: 'https://saypi.my.canva.site/',
    changeOrigin: true,
    followRedirects: true
}));

app.listen(process.env.PORT || 3000);
