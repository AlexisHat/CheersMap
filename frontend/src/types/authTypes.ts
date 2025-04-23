
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
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  };
  