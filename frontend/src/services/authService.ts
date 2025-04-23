import api from '../api/api';
import { updateStoredTokens } from '../helpers/authHelper';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RefreshResponse,
} from '../types/authTypes';


export const login = async (credentials: LoginRequest) => {
  try {
    const response = await api.post<AuthResponse>('/auth/login', credentials);

    const { accessToken, refreshToken } = response.data;

    if (!accessToken || !refreshToken) {
      throw new Error('Fehlende Token in der Serverantwort');
    }

    await updateStoredTokens(accessToken, refreshToken);

    return { accessToken, refreshToken };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Login fehlgeschlagen';
    throw new Error(message);
  }
};

export const register = async (userData: RegisterRequest) => {
  try {
    const response = await api.post<AuthResponse>('/auth/register', userData);

    const { accessToken, refreshToken } = response.data;

    if (!accessToken || !refreshToken) {
      throw new Error('Fehlende Token in der Serverantwort');
    }

    await updateStoredTokens(accessToken, refreshToken);
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Registrierung fehlgeschlagen';
    throw new Error(message);
  }
};

export const refreshAccessToken = async (
  oldRefreshToken: string
): Promise<RefreshResponse> => {
  try {
    const response = await api.post<RefreshResponse>('/auth/refresh', {
      refreshToken: oldRefreshToken,
    });

    const { accessToken, refreshToken } = response.data;

    if (!accessToken || !refreshToken) {
      throw new Error('Serverantwort unvollständig');
    }

    return { accessToken, refreshToken };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Fehler beim Refresh des Tokens';
    throw new Error(message);
  }
};


