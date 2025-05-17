const uploadService = require("../services/uploadService");

exports.createPost = async (req, res) => {
  try {
    const { locationId, comment } = req.body;
    const frontImage = req.files?.frontImage?.[0];
    const backImage = req.files?.backImage?.[0];
    

    if (!locationId || !comment || !frontImage || !backImage) {
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

    const post = await uploadService.createPost(
      locationId,
      comment,
      req.user.id,
      frontImageUrlKey,
      backImageUrlKey
    );

    return res.status(201).json({
      message: "Post successfully created.",
      post,
    });
  } catch (error) {
    console.error("Error in createPost:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
