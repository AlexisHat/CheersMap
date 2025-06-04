const Post = require("../models/Post");
const User = require("../models/User");
const { getSignedUrl } = require("../services/postService");

exports.searchUsersByQuery = async (query) => {
  if (!query || typeof query !== "string" || query.length < 2) {
    throw new Error("Suchbegriff ist zu kurz oder ungültig.");
  }

  const regex = new RegExp(`^${query}`, "i");

  const users = await User.find({
    username: { $regex: regex },
  })
    .limit(20)
    .select("_id username profilePicKey")
    .lean();

  const results = await Promise.all(
    users.map(async (user) => {
      let profileImageUrl = null;

      if (user.profilePicKey) {
        try {
          profileImageUrl = getSignedUrl(user.profilePicKey);
        } catch (err) {
          console.error(`Fehler bei signed URL für ${user.username}:`, err);
        }
      }

      return {
        _id: user._id,
        username: user.username,
        profileImage: profileImageUrl,
      };
    })
  );
  return results;
};

exports.getUserProfileForId = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  const posts = await Post.find({ user: user._id })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  const postPreviews = posts.map((post) => ({
    id: post._id.toString(),
    frontCamUrl: getSignedUrl(post.frontImageKey),
    backCamUrl: getSignedUrl(post.backImageKey),
  }));

  return {
    username: user.username,
    followers: 0,
    following: 0,
    city: user.city || "",
    posts: postPreviews,
  };
};
