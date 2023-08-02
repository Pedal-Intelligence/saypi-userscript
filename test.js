const request = require('supertest');
const app = require('./server');  // make sure to export your app in server.js

describe('GET /saypi.user.js', function () {
    it('responds with js', function (done) {
        request(app)
            .get('/saypi.user.js')
            .expect('Content-Type', /javascript/)
            .expect(200, done);
    });
});

describe('GET transcriber.js', function () {
    it('responds with js', function (done) {
        request(app)
            .get('transcriber.js')
            .expect('Content-Type', /javascript/)
            .expect(200, done);
    });
});

