const express = require("express");
const router = express.Router();
const employerController = require("../controllers/EmployerController");
const { verifyToken } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

router.post(
    "/register-job",
    verifyToken,
    allowRoles("Employer"),
    employerController.registerJob
);

router.get(
    "/myjobs",
    verifyToken,
    allowRoles("Employer"),
    employerController.getMyJobs
);

router.put(
    "/jobs/:id",
    verifyToken,
    allowRoles("Employer"),
    employerController.updateJob
);

router.delete(
    "/jobs/:id",
    verifyToken,
    allowRoles("Employer"),
    employerController.deleteJob
);

module.exports = router;
