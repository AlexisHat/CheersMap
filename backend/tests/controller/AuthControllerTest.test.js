const request = require("supertest");
const express = require("express");
const authController = require("../../src/controllers/authController");

const {
  registerUser,
  handleRefreshToken,
  logoutUser,
} = require("../../src/services/AuthService");

const app = express();
app.use(express.json());
app.post("/login", authController.login);
app.post("/register", authController.register);
app.post("/refresh", authController.refresh);
app.post("/logout", authController.logout);

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

test("POST /register - erfolgreich", async () => {
  registerUser.mockResolvedValue({
    accessToken: "token123",
    refreshToken: "refresh123",
  });

  const res = await request(app).post("/register").send({
    username: "newuser",
    password: "123456",
  });

  expect(res.statusCode).toBe(201);
  expect(res.body).toHaveProperty("accessToken");
  expect(res.body).toHaveProperty("refreshToken");
});

test("POST /refresh - erfolgreich", async () => {
  handleRefreshToken.mockResolvedValue({
    accessToken: "newAccessToken",
    refreshToken: "newRefreshToken",
  });

  const res = await request(app).post("/refresh").send({
    refreshToken: "validRefreshToken",
  });

  expect(res.statusCode).toBe(200);
  expect(res.body).toHaveProperty("accessToken", "newAccessToken");
  expect(res.body).toHaveProperty("refreshToken", "newRefreshToken");
});

test("POST /refresh - ungültiger Refresh-Token", async () => {
  handleRefreshToken.mockRejectedValueOnce({
    status: 403,
    message: "Ungültiger Refresh-Token",
  });

  const res = await request(app).post("/refresh").send({
    refreshToken: "invalidToken",
  });

  expect(res.statusCode).toBe(403);
  expect(res.body).toEqual({ message: "Ungültiger Refresh-Token" });
});

test("POST /logout - erfolgreich", async () => {
  logoutUser.mockResolvedValue({
    message: "Logout erfolgreich",
  });

  const res = await request(app).post("/logout").send({
    refreshToken: "validRefreshToken",
  });

  expect(res.statusCode).toBe(200);
  expect(res.body).toEqual({ message: "Logout erfolgreich" });
});

test("POST /logout - ungültiger Token", async () => {
  logoutUser.mockRejectedValueOnce({
    status: 400,
    message: "Refresh-Token ungültig oder nicht gefunden",
  });

  const res = await request(app).post("/logout").send({
    refreshToken: "invalidOrMissingToken",
  });

  expect(res.statusCode).toBe(400);
  expect(res.body).toEqual({
    message: "Refresh-Token ungültig oder nicht gefunden",
  });
});
