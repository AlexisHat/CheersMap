const uploadService = require("../services/uploadService");
const postService = require("../services/postService");
const { getSignedUrl } = require("../services/awsService");

exports.createPost = async (req, res) => {
  try {
    const { locationId, comment } = req.body;
    const frontImage = req.files?.frontImage?.[0];
    const backImage = req.files?.backImage?.[0];

    if (!locationId || !frontImage || !backImage) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const isValidFront = uploadService.validateImage(frontImage);
    const isValidBack = uploadService.validateImage(backImage);

    if (!isValidFront || !isValidBack) {
      return res.status(400).json({ message: "Invalid image file." });
    }

    const frontImageUrlKey = await uploadService.uploadToS3(
      frontImage,
      `posts/${locationId}/front.jpg`
    );
    const backImageUrlKey = await uploadService.uploadToS3(
      backImage,
      `posts/${locationId}/back.jpg`
    );

    const post = await postService.createPost(
      locationId,
      comment,
      req.user.id,
      frontImageUrlKey,
      backImageUrlKey
    );

    const frontImageUrl = getSignedUrl(frontImageUrlKey);
    const backImageUrl = getSignedUrl(backImageUrlKey);

    return res.status(201).json({
      message: "Post successfully created.",
      post,
      frontImageUrl,
      backImageUrl,
    });
  } catch (error) {
    console.error("Error in createPost:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

exports.uploadProfilePic = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "Kein Bild hochgeladen." });
    }

    if (!uploadService.validateImage(file, 1 * 1024 * 1024)) {
      return res.status(400).json({
        message: "Profilbild zu groß. Maximalgröße: 1 MB.",
      });
    }
    const extension = file.mimetype.split("/")[1];

    const saveKey = `profilepics/${req.user.id}/profile.${extension}`;

    const pbS3Key = await uploadService.uploadProfilePictureToS3(file, saveKey);

    return res.status(200).json({ key: pbS3Key });
  } catch (error) {
    console.error("Fehler beim Hochladen des Profilbilds:", error);
    return res.status(500).json({ message: "Upload fehlgeschlagen" });
  }
};
