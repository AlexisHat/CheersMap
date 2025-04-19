const RefreshToken = require("../models/RefreshToken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const {
  generateAccessToken,
  hash,
  generateRefreshToken,
} = require("../utils/tokenUtils");

const handleRefreshToken = async (incomingToken) => {
  if (!incomingToken) {
    throw { status: 401, message: "Kein Refresh Token" };
  }

  const tokenHash = hash(incomingToken);
  const stored = await RefreshToken.findOne({ tokenHash });
  if (!stored) {
    throw { status: 403, message: "Ungültiges Token" };
  }

  const user = await User.findById(stored.user);
  if (!user) {
    throw { status: 403, message: "Benutzer nicht gefunden" };
  }

  await RefreshToken.deleteOne({ _id: stored._id });

  const newRefreshToken = await createAndStoreRefreshToken(user);
  const newAccessToken = generateAccessToken(user);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

const createAndStoreRefreshToken = async (user) => {
  const token = generateRefreshToken();
  await RefreshToken.create({
    token: hash(token),
    user: user,
  });
  return token;
};

const loginUser = async (username, password) => {
  const user = await User.findOne({ username });
  if (!user) throw { status: 401, message: "User nicht gefunden" };

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw { status: 401, message: "Falsches Passwort" };

  const accessToken = generateAccessToken(user);
  const refreshToken = await createAndStoreRefreshToken(user);

  return { accessToken, refreshToken };
};

const registerUser = async (userData) => {
  const { vorname, nachname, email, username, password } = userData;

  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    throw { status: 400, message: "Benutzername oder E-Mail bereits vergeben" };
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

  console.log("👉 newUser:", newUser);

  const accessToken = generateAccessToken(newUser);
  const refreshToken = await createAndStoreRefreshToken(newUser);

  return {
    message: "Benutzer erfolgreich registriert",
    accessToken,
    refreshToken,
  };
};

const logoutUser = async (refreshToken) => {
  if (!refreshToken) {
    const error = new Error("Kein Refresh Token angegeben.");
    error.status = 400;
    throw error;
  }

  const deletedToken = await RefreshToken.findOneAndDelete({
    token: refreshToken,
  });

  if (!deletedToken) {
    const error = new Error("Refresh Token nicht gefunden.");
    error.status = 404;
    throw error;
  }

  return { message: "Erfolgreich ausgeloggt." };
};

module.exports = {
  handleRefreshToken,
  createAndStoreRefreshToken,
  loginUser,
  registerUser,
  logoutUser,
};
