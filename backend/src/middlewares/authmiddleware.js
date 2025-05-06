import jwt from "jsonwebtoken";

export function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Kein Token übermittelt" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      console.error("JWT Fehler:", err.message);
      return res
        .status(403)
        .json({ message: "Token ungültig oder abgelaufen lol" });
    }

    req.user = payload;
    next();
  });
}
