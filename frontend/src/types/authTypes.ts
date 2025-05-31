export type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
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
