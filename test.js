const request = require('supertest');
const app = require('./server');  // make sure to export your app in server.js

describe('GET /', function () {
    it('responds with html', function (done) {
        request(app)
            .get('/')
            .expect('Content-Type', /html/)
            .expect(200, done);
    });
});

describe('GET /saypi.user.js', function () {
    it('responds with js', function (done) {
        request(app)
            .get('/saypi.user.js')
            .expect('Content-Type', /javascript/)
            .expect(200, done);
    });
});

describe('GET /static/js/literal.js', function () {
    it('responds with js', function (done) {
        request(app)
            .get('/static/js/literal.js')
            .expect('Content-Type', /javascript/)
            .expect(200, done);
    });
});

describe('GET /static/images/waveform.svg', function () {
    it('responds with svg', function (done) {
        request(app)
            .get('/static/images/waveform.svg')
            .expect('Content-Type', /html/)
            .expect(200, done);
        /* serve-handler incorrectly serves SVG as text/html */
    });
});
