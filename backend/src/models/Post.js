// post.model.js
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    required: true,
  },
  comment: { type: String, required: true },
  frontImageKey: { type: String, required: true },
  backImageKey: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", postSchema);
