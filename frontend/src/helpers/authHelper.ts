import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../store/authStore';

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
