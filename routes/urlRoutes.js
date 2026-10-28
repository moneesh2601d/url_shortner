const express = require("express");

const { showDashboard,createShortUrl } = require("../controllers/urlController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/dashboard",
    authMiddleware,
    showDashboard
);

router.post(
    "/shorten",
    authMiddleware,
    createShortUrl
);


module.exports = router;