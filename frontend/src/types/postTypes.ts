export type LocationItem = {
  id: string;
  name: string;
  address: string;
  distance: number;
  primaryType: string;
};

export type PostPreview = {
  id: string;
  frontCamUrl: string;
  backCamUrl: string;
};

export type UserProfileData = {
  username: string;
  profilePicUrl: string;
  followers: number;
  following: number;
  city: string;
  posts: PostPreview[];
};
