// bundles.test.ts
import request from "supertest";
import app from "../server"; // the express server
import { expect } from "@jest/globals";

describe("GET Say, Pi userscript", () => {
  it("responds with js", async () => {
    const response = await request(app).get("/saypi.user.js");
    expect(response.headers["content-type"]).toMatch(/javascript/);
    expect(response.statusCode).toBe(200);
  });
});

describe("GET audio module bundle", () => {
  it("responds with js", async () => {
    const response = await request(app).get("/audioModule.bundle.js");
    expect(response.headers["content-type"]).toMatch(/javascript/);
    expect(response.statusCode).toBe(200);
  });
});
