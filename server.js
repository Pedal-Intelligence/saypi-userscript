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

app.use('/static/images/*', (req, res) => {
    serveHandler(req, res, {
        public: 'public',
    });
});

app.use('/static/video/*', (req, res) => {
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

app.use('*', createProxyMiddleware({
    target: 'https://saypi.my.canva.site/',
    changeOrigin: true,
    followRedirects: true
}));

if (require.main === module) {
    // This means this file was run directly from command line, so start the server
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server listening on port ${process.env.PORT || 3000}`);
    });
} else {
    // This file was required from another module, so export the app without starting the server
    module.exports = app;
}
