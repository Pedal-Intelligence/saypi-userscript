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

        // Loop over all anchor tags
        $('a').each((index, element) => {
            // Extract the href value
            const href = $(element).attr('href');

            // Check if it matches the pattern
            if (href && href.includes('/_link/?link=')) {
                // Extract the link query parameter
                const parsedUrl = url.parse(href, true);
                const link = decodeURIComponent(parsedUrl.query.link);

                // Replace the href with the extracted link
                $(element).attr('href', link);
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
