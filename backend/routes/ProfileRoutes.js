const express = require("express");
const router = express.Router();
const upload = require("../middleware/Upload");
const { verifyToken } = require("../middleware/authMiddleware");
const ProfileController = require("../controllers/ProfileController");

// Get my profile
router.get("/me", verifyToken, ProfileController.getMyProfile);

// Update my profile (with optional profile picture)
router.put(
    "/me",
    verifyToken,
    upload.single("ProfilePic"),
    ProfileController.updateMyProfile
);

module.exports = router;
