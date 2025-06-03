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
