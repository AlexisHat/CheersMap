const uploadService = require("../services/uploadService");
const { getSignedUrl } = require("../services/postService");

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
