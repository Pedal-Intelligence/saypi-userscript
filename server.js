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

app.all(['/', '/index.html'], async (req, res) => {
    try {
        const response = await axios.get('https://saypi.my.canva.site/', { responseType: 'text' });
        const $ = cheerio.load(response.data);

        // Find the link and change its href
        $('a').each((index, element) => {
            const href = $(element).attr('href');
            if (href && url.parse(href).pathname === '/_link/' && href.includes('saypi.user.js')) {
                $(element).attr('href', '/saypi.user.js');
            }
        });

        // Send the modified HTML
        res.send($.html());
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.use('/static', (req, res) => {
    serveHandler(req, res, {
        public: 'public',
    });
});

app.use('*', createProxyMiddleware({
    target: 'https://saypi.my.canva.site/',
    changeOrigin: true,
    followRedirects: true
}));

app.listen(process.env.PORT || 3000);
