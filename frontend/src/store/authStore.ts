import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { refreshAccessToken } from '../services/authService'; // ggf. Pfad anpassen

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (tokens: { accessToken: string; refreshToken: string }) => Promise<void>;
  logout: () => Promise<void>;
  checkLoginStatus: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,

  login: async ({ accessToken, refreshToken }) => {
    await AsyncStorage.setItem('accessToken', accessToken);
    await AsyncStorage.setItem('refreshToken', refreshToken);
    set({
      accessToken,
      refreshToken,
      isAuthenticated: true,
    });
  },

  logout: async () => {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    set({
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },

  checkLoginStatus: async () => {
    set({ isLoading: true });

    try {
      const storedAccessToken = await AsyncStorage.getItem('accessToken');
      const storedRefreshToken = await AsyncStorage.getItem('refreshToken');

      if (storedAccessToken) {
        set({
          accessToken: storedAccessToken,
          refreshToken: storedRefreshToken,
          isAuthenticated: true,
        });
      } else if (storedRefreshToken) {
        try {
          const { accessToken, refreshToken } = await refreshAccessToken(storedRefreshToken);

          await AsyncStorage.setItem('accessToken', accessToken);
          await AsyncStorage.setItem('refreshToken', refreshToken);

          set({
            accessToken,
            refreshToken,
            isAuthenticated: true,
          });
        } catch (refreshError) {
          console.error('Token-Refresh fehlgeschlagen:', refreshError);
          await AsyncStorage.removeItem('accessToken');
          await AsyncStorage.removeItem('refreshToken');
          set({
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
          });
        }
      } else {
        set({
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      }
    } catch (error) {
      console.error('Fehler beim Login-Check:', error);
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      set({
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));
