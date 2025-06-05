const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comment: { type: String, required: false },
  frontImageKey: { type: String, required: true },
  backImageKey: { type: String, required: true },
  imageHashFront: { type: String, required: true },
  imageHashBack: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

postSchema.index(
  { user: 1, imageHashFront: 1, imageHashBack: 1 },
  { unique: true }
);

module.exports = mongoose.model("Post", postSchema);
