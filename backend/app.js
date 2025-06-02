const express = require("express");
const app = express();

app.use(express.json());

const authRouter = require("./src/routes/authRoutes");
const locationRoutes = require("./src/routes/locationRoutes");
const uploadRoutes = require("./src/routes/uploadRoutes");
const profileRoutes = require("./src/routes/profileRoutes");

app.use("/upload", uploadRoutes);

app.use("/auth", authRouter);

app.use("/locations", locationRoutes);

app.use("/profile", profileRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "❌ Route nicht gefunden" });
});

module.exports = app;
