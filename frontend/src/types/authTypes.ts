export type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  vorname: string;
  nachname: string;
  username: string;
  password: string;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type City = {
  name: string;
  lat: number;
  lon: number;
};

export interface User {
  id: string;
  username: string;
  vorname?: string;
  nachname?: string;
  email?: string;
  profilePicUrl?: string | null;
  city?: string | null;
}
