import axios from 'axios';
import { refreshAccessToken } from '../services/tokenService';
import {
  getStoredRefreshToken,
  updateStoredTokens,
  clearStoredTokens,
  getStoredAccessToken,
} from '../helpers/authHelper';

const api = axios.create({
  baseURL: 'http://192.168.0.71:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const accessToken = await getStoredAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = await getStoredRefreshToken();

    const isTokenExpired =
      error.response?.status === 401 &&
      error.response?.data?.message === 'Access token expired';

    if (isTokenExpired && !originalRequest._retry && refreshToken) {
      originalRequest._retry = true;

      try {
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          await refreshAccessToken(refreshToken);

        await updateStoredTokens(newAccessToken, newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        await clearStoredTokens();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
