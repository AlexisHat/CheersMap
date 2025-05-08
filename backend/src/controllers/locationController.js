const axios = require("axios");
const { searchNearbyPlaces } = require("../services/locationService");

exports.getLocationsNearby = async (req, res) => {
  const { lat, long, maxResults } = req.query;

  if (!lat || !long) {
    return res
      .status(400)
      .json({ message: "Latitude und Longitude erforderlich" });
  }

  try {
    const results = await searchNearbyPlaces(lat, long, maxResults);
    res.json({ results });
  } catch (error) {
    console.error("Fehler im Controller:", error.message);
    res.status(500).json({ message: "Fehler beim Abrufen der Orte" });
  }
};
