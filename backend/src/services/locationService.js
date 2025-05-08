const axios = require("axios");

exports.searchNearbyPlaces = async (lat, long, maxResults = 10) => {
  const apiKey = process.env.GOOGLE_PLACE_API_KEY;

  const types = ["cafe", "bakery", "bar", "restaurant"];
  const radiusInMeters = 1075; //noch richtigen wert überlegen

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
          radius: radiusInMeters,
        },
      },
      maxResultCount: maxResults,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "places.displayName,places.formattedAddress,places.location,places.id,places.googleMapsUri,places.primaryType",
      },
    }
  );

  const places = response.data.places || [];

  const mapped = places.map((place) => ({
    name: place.displayName?.text || "Unbenannt",
    address: place.formattedAddress,
    id: place.id,
  }));

  return mapped;
};
