const axios = require("axios");
const NodeCache = require("node-cache");
const locationCache = require("../services/cache");

const rquestCache = new NodeCache({ stdTTL: 1000 });

//Funktion zum Distanzen berechnen
const haversineDistance = (from, to) => {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371000; // Meter
  const dLat = toRad(to.lat - from.lat);
  const dLon = toRad(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(from.lat)) *
      Math.cos(toRad(to.lat)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

exports.searchNearbyPlaces = async (lat, long, maxResults = 10) => {
  const cacheKey = `${lat},${long},${maxResults}`;

  const cachedData = rquestCache.get(cacheKey);
  if (cachedData) {
    console.log("Cache hit");
    return cachedData;
  }

  const apiKey = process.env.GOOGLE_PLACE_API_KEY;

  const types = ["cafe", "bakery", "bar", "restaurant", "meal_takeaway"];
  const radiusInMeters = 100; //noch richtigen wert überlegen

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

  for (const place of places) {
    if (place.id) {
      locationCache.set(place.id, place);
    }
  }

  const mapped = places.map((place) => {
    const distance = Math.round(
      haversineDistance(
        { lat: lat, lng: long },
        {
          lat: place.location.latitude,
          lng: place.location.longitude,
        }
      )
    );
  
    return {
      name: place.displayName?.text || "Unbenannt",
      address: place.formattedAddress,
      id: place.id,
      distance: distance, // in Metern
    };
  });
  
  mapped.sort((a, b) => a.distance - b.distance);
  
  locationCache.set(cacheKey, mapped);
  console.log("Cache miss – Daten gespeichert");
  
  return mapped;
  console.log(mapped);
};  
