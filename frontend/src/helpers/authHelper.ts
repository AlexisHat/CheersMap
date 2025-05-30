import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../store/authStore';
import { City } from "../types/authTypes"
import cities from "../../assets/Orte-Deutschland.json";


const getStore = () => useAuthStore.getState();

export const getStoredRefreshToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('refreshToken');
};

export const getStoredAccessToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('accessToken');
};
export const updateStoredTokens = async (accessToken: string, refreshToken: string) => {
  await AsyncStorage.setItem('accessToken', accessToken);
  await AsyncStorage.setItem('refreshToken', refreshToken);

  useAuthStore.setState({
    accessToken,
    refreshToken,
    isAuthenticated: true,
  });
};

export const clearStoredTokens = async () => {
  await AsyncStorage.removeItem('accessToken');
  await AsyncStorage.removeItem('refreshToken');

  useAuthStore.setState({
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
  });
};

export const toRad = (value: number) => (value * Math.PI) / 180;

export const EARTH_RADIUS_KM = 6371;

export const haversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
};

export const findNearestCity = (userLat: number, userLon: number): City | null => {
  let nearest: City | null = null;
  let minDistance = Infinity;

  for (const city of cities as City[]) {
    const dist = haversineDistance(userLat, userLon, city.lat, city.lon);

    if (dist < minDistance) {
      minDistance = dist;
      nearest = city;
    }
  }
  return nearest;
};