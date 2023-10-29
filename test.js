import request from "supertest";
import app from "./server.js"; // make sure to export your app in server.js

describe("GET /saypi.user.js", function () {
  it("responds with js", function (done) {
    request(app)
      .get("/saypi.user.js")
      .expect("Content-Type", /javascript/)
      .expect(200, done);
  });
});
