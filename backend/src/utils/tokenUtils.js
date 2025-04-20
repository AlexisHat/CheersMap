const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

function generateAccessToken(user) {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      role: user.role,
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
}

const hash = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

function generateRefreshToken() {
  return crypto.randomBytes(64).toString("hex");
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  hash,
};
