const request = require("supertest");
const express = require("express");
const authController = require("../../src/controllers/authController");

const app = express();
app.use(express.json());
app.post("/login", authController.login);

jest.mock("../../src/services/AuthService", () => ({
  loginUser: jest
    .fn()
    .mockResolvedValue({ accessToken: "ok", refreshToken: "ok" }),
  registerUser: jest.fn(),
  handleRefreshToken: jest.fn(),
  logoutUser: jest.fn(),
}));

test("POST /login antwortet mit 200", async () => {
  const res = await request(app)
    .post("/login")
    .send({ username: "test", password: "test" });

  expect(res.statusCode).toBe(200);
});
