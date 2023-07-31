const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const serveHandler = require('serve-handler');

const app = express();

app.all(['/', '/index.html'], createProxyMiddleware({
    target: 'https://saypi.my.canva.site/',
    changeOrigin: true,
    followRedirects: true
}));

app.use((req, res, next) => {
    if (req.method === 'GET') {
        return serveHandler(req, res, {
            public: 'public' // directory to serve
        });
    }
    next();
});

app.use(createProxyMiddleware({
    target: 'https://saypi.my.canva.site/',
    changeOrigin: true,
    followRedirects: true
}));

app.listen(process.env.PORT || 3000);
