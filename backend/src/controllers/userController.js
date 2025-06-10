const {
  searchUsersByQuery,
  getUserProfileForId,
  getProfiledPicUrlForUser,
} = require("../services/userService");

const searchUsers = async (req, res) => {
  const { query } = req.query;

  try {
    const results = await searchUsersByQuery(query);
    res.status(200).json(results);
  } catch (err) {
    console.error("Fehler bei der Suche:", err.message);
    if (err.message.includes("zu kurz") || err.message.includes("ungültig")) {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Serverfehler bei der Suche." });
  }
};

const getUserProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const profileData = await getUserProfileForId(userId);
    return res.status(200).json(profileData);
  } catch (err) {
    if (err.message === "USER_NOT_FOUND") {
      return res.status(404).json({ message: "User not found" });
    }

    console.error("Fehler im getUserProfile:", err);
    return res.status(500).json({ message: "Serverfehler" });
  }
};

const getProfilePicUrl = async (req, res) => {
  const userId = req.user.id;
  try {
    const profiledPicUrl = await getProfiledPicUrlForUser(userId);
    return res.status(200).json({ url: profiledPicUrl });
  } catch (err) {
    if (err.message === "USER_NOT_FOUND") {
      return res.status(404).json({ message: "User not found" });
    }

    console.error("Fehler im getUserProfile:", err);
    return res.status(500).json({ message: "Serverfehler" });
  }
};

module.exports = {
  searchUsers,
  getUserProfile,
  getProfilePicUrl,
};
