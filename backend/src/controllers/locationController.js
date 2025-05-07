const axios = require("axios");

exports.getLocationsNearby = async (req, res) => {
  const { lat, long, maxResults = 10 } = req.query;

  if (!lat || !long) {
    return res
      .status(400)
      .json({ message: "Latitude und Longitude erforderlich" });
  }

  types = ["cafe", "bakery", "bar", "restaurant"];

  try {
    const apiKey = process.env.GOOGLE_PLACE_API_KEY;

    const response = await axios.post(
      "https://places.googleapis.com/v1/places:searchNearby",
      {
        includedTypes: types,
        locationRestriction: {
          circle: {
            center: {
              latitude: lat,
              longitude: long,
            },
            radius: 1075, //noch richtigen wert überlegen
          },
        },
        maxResultCount: maxResults,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "places.displayName,places.formattedAddress,places.location,places.id", //* für alle
        },
      }
    );

    const places = response.data.places || [];

    console.log(places);

    const mapped = places.map((place) => ({
      name: place.displayName?.text || "Unbenannt",
      address: place.formattedAddress,
      id: place.id,
    }));

    res.json({ results: mapped });
  } catch (error) {
    console.error(
      "Fehler bei Nearby Search:",
      error.response?.data || error.message
    );
    res.status(500).json({ message: "Fehler beim Abrufen der Orte" });
  }
};
