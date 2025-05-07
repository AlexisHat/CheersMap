import axios from "../api/api";

export const fetchNearbyLocations = async (latitude: number, longitude: number, max: number) => {
  const response = await axios.get("/locations/nearby", {
    params: { lat: latitude, long: longitude, maxResults: max},
  });
  return response.data;
};
