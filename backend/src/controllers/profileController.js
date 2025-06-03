const User = require("../models/User");
const { getSignedUrl } = require("../services/postService");

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { profilePicKey, city, username } = req.body;

    const updates = {};
    if (profilePicKey !== undefined) updates.profilePicKey = profilePicKey;
    if (city !== undefined) updates.city = city;
    if (username !== undefined) updates.username = username;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "Keine gültigen Felder zum Aktualisieren übergeben.",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "Benutzer nicht gefunden." });
    }

    res.status(200).json({
      message: "Profil erfolgreich aktualisiert.",
      user: {
        profilePicSignedUrl: getSignedUrl(updatedUser.profilePicKey, 7000), // TODO ggf. anpassen
        city: updatedUser.city,
        username: updatedUser.username,
      },
    });
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Profils:", error);
    res
      .status(500)
      .json({ message: "Serverfehler beim Aktualisieren des Profils." });
  }
};
