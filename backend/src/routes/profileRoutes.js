const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authmiddleware");

const controller = require("../controllers/profileController");

router.use(authenticateToken);

router.post("/update", authenticateToken, controller.updateProfile);

module.exports = router;
