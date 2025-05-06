const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authmiddleware");

const controller = require("../controllers/locationController");

router.use(authenticateToken);

router.get("/nearby", controller.getLocationsNearby);

module.exports = router;
