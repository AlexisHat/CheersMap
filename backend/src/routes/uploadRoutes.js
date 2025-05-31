const express = require("express");
const multer = require("multer");
const router = express.Router();

const controller = require("../controllers/uploadController");
const { authenticateToken } = require("../middlewares/authmiddleware");

const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/create-post",
  authenticateToken,
  upload.fields([
    { name: "frontImage", maxCount: 1 },
    { name: "backImage", maxCount: 1 },
  ]),
  controller.createPost
);

router.post(
  "/profilepicture",
  authenticateToken,
  upload.single("frontImage"),
  controller.uploadProfilePic
);

module.exports = router;
