const express = require("express");
const upload = require("../middleware/Upload");
const router = express.Router();

const {
    applyJob,
    getMyApplications,
    getReceivedApplications,
    updateApplicationStatus
} = require("../controllers/ApplicationController");

const { verifyToken } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

router.post(
    "/apply",
    verifyToken,
    allowRoles("JobSeeker"),
    upload.single("Resume"),
    applyJob
);

router.get(
    "/my",
    verifyToken,
    allowRoles("JobSeeker"),
    getMyApplications
);

router.get(
    "/received",
    verifyToken,
    allowRoles("Employer"),
    getReceivedApplications
);

router.put(
    "/status/:id",
    verifyToken,
    allowRoles("Employer"),
    updateApplicationStatus
);

module.exports = router;
