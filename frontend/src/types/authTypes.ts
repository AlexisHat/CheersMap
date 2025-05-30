
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
    city?: string;
    imageUri?: string;
  };
  
  export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
    ProfileCreation: {
      email: string;
      vorname: string;
      nachname: string;
      username: string;
      password: string;
    };
  };
  
  export type City = {
    name: string;
    lat: number; 
    lon: number;
  };