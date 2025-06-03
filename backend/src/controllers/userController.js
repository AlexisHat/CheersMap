const User = require("../models/User");
const { getSignedUrl } = require("../services/postService");

const searchUsers = async (req, res) => {
  const { query } = req.query;

  const logPrefix = `[UserSearch] ${new Date().toISOString()}`;

  if (!query || typeof query !== "string" || query.length < 2) {
    console.warn(`${logPrefix} Ungültiger Suchbegriff: "${query}"`);
    return res
      .status(400)
      .json({ message: "Suchbegriff ist zu kurz oder ungültig." });
  }

  try {
    console.log(`${logPrefix} Suche gestartet: "${query}"`);

    const regex = new RegExp(`^${query}`, "i");

    const users = await User.find({
      username: { $regex: regex },
    })
      .limit(20)
      .select("_id username profilePicKey");

    const results = await Promise.all(
      users.map(async (user) => {
        let profileImageUrl = null;

        if (user.profilePicKey) {
          try {
            profileImageUrl = getSignedUrl(user.profilePicKey);
          } catch (err) {
            console.error(
              `${logPrefix} Fehler bei signed URL für ${user.username}:`,
              err
            );
          }
        }

        return {
          _id: user._id,
          username: user.username,
          profileImage: profileImageUrl,
        };
      })
    );

    console.log(
      `${logPrefix} Erfolgreich: ${results.length} Nutzer gefunden für "${query}"`
    );

    res.status(200).json(results);
  } catch (err) {
    console.error(`${logPrefix} Fehler bei der Suche:`, err);
    res.status(500).json({ message: "Serverfehler bei der Suche." });
  }
};

module.exports = {
  searchUsers,
};
