import api from "../api/api";
import axios from "../api/api";

export const updateProfile = async (
  profilePicKey?: string,
  city?: string,
  username?: string
) => {
  const payload: {
    profilePicKey?: string;
    city?: string;
    username?: string;
  } = {};

  if (profilePicKey) payload.profilePicKey = profilePicKey;
  if (city) payload.city = city;
  if (username) payload.username = username;

  if (Object.keys(payload).length === 0) return;

  const response = await axios.post("/profile/update", payload);

  return response.data.user;
};

export const isSignedUrlValid = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch (error) {
    console.warn("URL nicht erreichbar oder abgelaufen:", error);
    return false;
  }
};

export const getNewProfilePicUrl = async (): Promise<string> => {
  const response = await api.get("/users/profile-pic");
  return response.data.url;
};
