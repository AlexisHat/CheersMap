import api from "../api/api";
import {
  getStoredRefreshToken,
  updateStoredTokens,
} from "../helpers/authHelper";
import { useAuthStore } from "../store/authStore";
import { useUserStore } from "../store/profileStore";
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../types/authTypes";

export const login = async (credentials: LoginRequest) => {
  try {
    const response = await api.post<AuthResponse>("/auth/login", credentials);

    const { accessToken, refreshToken, user } = response.data;

    if (!accessToken || !refreshToken) {
      throw new Error("Fehlende Token in der Serverantwort");
    }

    await updateStoredTokens(accessToken, refreshToken);

    const { setUser } = useUserStore.getState();
    setUser(user);

    return { accessToken, refreshToken };
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || "Login fehlgeschlagen";
    throw new Error(message);
  }
};

export const register = async (userData: RegisterRequest) => {
  try {
    const response = await api.post<AuthResponse>("/auth/register", userData);

    const { accessToken, refreshToken } = response.data;

    if (!accessToken || !refreshToken) {
      throw new Error("Fehlende Token in der Serverantwort");
    }

    await updateStoredTokens(accessToken, refreshToken);
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Registrierung fehlgeschlagen";
    throw new Error(message);
  }
};

export const logout = async () => {
  try {
    const refreshToken = await getStoredRefreshToken();

    console.log(refreshToken);
    await api.post("auth/logout", { refreshToken });
  } catch (error: any) {
    console.error("Logout-Fehler:", error);
  } finally {
    await useAuthStore.getState().logout();
  }
};
