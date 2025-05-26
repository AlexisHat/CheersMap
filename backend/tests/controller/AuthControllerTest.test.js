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

afterEach(() => {
  jest.clearAllMocks();
});

test("POST /login antwortet mit 200", async () => {
  const res = await request(app)
    .post("/login")
    .send({ username: "test", password: "test" });

  expect(res.statusCode).toBe(200);
});

test("POST /login - fehlendes Passwort", async () => {
  const res = await request(app).post("/login").send({ username: "testuser" });

  expect(res.statusCode).toBe(400);
  expect(res.body).toHaveProperty("message");
});

test("POST /login - fehlender Username", async () => {
  const res = await request(app).post("/login").send({ password: "testpass" });

  expect(res.statusCode).toBe(400);
  expect(res.body).toEqual({
    message: "Username und Passwort sind erforderlich.",
  });
});

const { loginUser } = require("../../src/services/AuthService");

test("POST /login - ungültige Zugangsdaten", async () => {
  loginUser.mockRejectedValueOnce({
    status: 401,
    message: "Ungültige Zugangsdaten",
  });

  const res = await request(app)
    .post("/login")
    .send({ username: "wrong", password: "wrong" });

  expect(res.statusCode).toBe(401);
  expect(res.body).toEqual({ message: "Ungültige Zugangsdaten" });
});

test("POST /login - Tokens sind im Response-Body enthalten", async () => {
  const res = await request(app)
    .post("/login")
    .send({ username: "testuser", password: "testpass" });

  expect(res.statusCode).toBe(200);

  expect(res.body).toHaveProperty("accessToken");
  expect(typeof res.body.accessToken).toBe("string");

  expect(res.body).toHaveProperty("refreshToken");
  expect(typeof res.body.refreshToken).toBe("string");
});
