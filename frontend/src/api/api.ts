import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../store/authStore';
import { refreshAccessToken } from '../services/authService';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const accessToken = await AsyncStorage.getItem('accessToken');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      const { refreshToken, login, logout } = useAuthStore.getState();
  
      const isTokenExpired =
        error.response?.status === 401 &&
        error.response?.data?.message === 'Access token expired';
  
      if (isTokenExpired && !originalRequest._retry && refreshToken) {
        originalRequest._retry = true;
  
        const newAccessToken = await refreshAccessToken(refreshToken);
  
        if (newAccessToken) {
          await AsyncStorage.setItem('accessToken', newAccessToken);
          await login({ accessToken: newAccessToken, refreshToken });
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } else {
          await logout();
        }
      }
  
      return Promise.reject(error);
    }
  );
  

export default api;
