import api from '../api/api';
import { RefreshResponse } from '../types/authTypes';

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
