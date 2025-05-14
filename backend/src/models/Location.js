const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  formattedAddress: { type: String, required: true },
  placeId: { type: String, required: true, unique: true },
  googleMapsUri: { type: String },
  primaryType: { type: String },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
});

module.exports = mongoose.model("Location", locationSchema);
