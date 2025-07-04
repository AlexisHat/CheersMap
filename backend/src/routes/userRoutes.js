const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authmiddleware");

const controller = require("../controllers/userController");

router.use(authenticateToken);

router.get("/search", authenticateToken, controller.searchUsers);

router.get("/getprofile/:userId", controller.getUserProfile);

router.get("/getProfilePicUrl", authenticateToken, controller.getProfilePicUrl);

module.exports = router;
