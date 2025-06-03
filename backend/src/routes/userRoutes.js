const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authmiddleware");

const controller = require("../controllers/userController");

router.use(authenticateToken);

router.get("/search", authenticateToken, controller.searchUsers);

module.exports = router;
