const express = require("express");
const router = express.Router();

const controller = require("../controllers/uploadController");

router.post("/create-post", controller.createPost);

module.exports = router;
