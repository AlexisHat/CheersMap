const express = require("express");
const router = express.Router();

const controller = require("../controllers/uploadController");
const { authenticateToken } = require("../middlewares/authmiddleware");

router.post("/create-post", authenticateToken, controller.createPost);

module.exports = router;
