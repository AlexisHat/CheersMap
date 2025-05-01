const express = require("express");
const app = express();

app.use(express.json());

const authRouter = require("./src/routes/authRoutes");

const uploadRoutes = require("./src/routes/uploadRoutes");

app.use("/upload", uploadRoutes);

app.use("/auth", authRouter);

app.use((req, res) => {
  res.status(404).json({ message: "❌ Route nicht gefunden" });
});

module.exports = app;
