const jwtProvider = require("jsonwebtoken");
const RefreshToken = require("../models/RefreshToken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const {
  loginUser,
  registerUser,
  handleRefreshToken,
  logoutUser,
} = require("../services/AuthService");

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const tokens = await loginUser(username, password);
    res.json(tokens);
  } catch (err) {
    console.error("Login-Fehler:", err);
    res
      .status(err.status || 500)
      .json({ message: err.message || "Serverfehler" });
  }
};

exports.register = async (req, res) => {
  try {
    const tokens = await registerUser(req.body);
    res.status(201).json(tokens);
  } catch (err) {
    console.error("Registrierungsfehler:", err);
    res
      .status(err.status || 500)
      .json({ message: err.message || "Serverfehler" });
  }
};

exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const tokens = await handleRefreshToken(refreshToken);
    res.json(tokens);
  } catch (err) {
    console.error("Error in refresh token:", err);
    res
      .status(err.status || 500)
      .json({ message: err.message || "Serverfehler" });
  }
};

exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const result = await logoutUser(refreshToken);
    res.json(result);
  } catch (err) {
    console.error("Error in refresh token:", err);
    res
      .status(err.status || 500)
      .json({ message: err.message || "Serverfehler" });
  }
};
