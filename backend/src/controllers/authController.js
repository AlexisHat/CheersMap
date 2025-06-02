const {
  loginUser,
  registerUser,
  handleRefreshToken,
  logoutUser,
} = require("../services/AuthService");

exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username und Passwort sind erforderlich." });
  }

  try {
    const result = await loginUser(username, password);
    res.json(result);
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
