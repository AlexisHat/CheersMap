import axios from "../api/api";

export const fetchNearbyLocations = async (latitude: number, longitude: number) => {
  const response = await axios.get("/locations/nearby", {
    params: { lat: latitude, lon: longitude },
  });
  return response.data;
};
