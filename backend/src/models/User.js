const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["user", "admin"], default: "user" },
    vorname: { type: String, required: true },
    nachname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicKey: { type: String, default: null },
    city: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ username: 1 });

module.exports = mongoose.model("User", userSchema);
