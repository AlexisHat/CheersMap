const jwtProvider = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
require("dotenv").config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

exports.login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) return res.status(401).json({ message: "User nicht gefunden" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: "Falsches Passwort" });

  const payload = {
    id: user._id,
    username: user.username,
    role: user.role,
  };

  const accessToken = jwtProvider.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwtProvider.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });

  res.json({
    accessToken,
    refreshToken,
  });
};

exports.register = async (req, res) => {
  const { vorname, nachname, email, username, password } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Benutzername oder E-Mail bereits vergeben" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      vorname,
      nachname,
      email,
      username,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "Benutzer erfolgreich registriert" });
  } catch (error) {
    console.error("Fehler bei der Registrierung:", error);
    res.status(500).json({ message: "Interner Serverfehler" });
  }
};
