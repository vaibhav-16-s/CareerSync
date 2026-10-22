const express = require("express");
const admincontroller = require("../controllers/AdminController");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

//--------------------post--------------------
router.post("/admin_register", admincontroller.AdminRegister);
router.post("/employer_register", admincontroller.EmployerRegister);

//--------------------get----------------------
// Put specific routes BEFORE /:id so they are not treated as an id
router.get(
    "/dashboard",
    verifyToken,
    allowRoles("Admin"),
    admincontroller.getDashboardStats
);

router.get("/search", admincontroller.searchEmployer);
router.get("/jobseekers", admincontroller.getAllJobSeekers);
router.get("/jobseekers/search", admincontroller.searchJobSeeker);
router.get("/jobseekers/:id", admincontroller.getJobSeekerById);

router.get("/", admincontroller.getAllEmployers);
router.get("/:id", admincontroller.getEmployerById);

//--------------------put----------------------
router.put("/employer/:id", admincontroller.updateEmployer);
router.put("/update-password/:id", admincontroller.updatePassword);

//-------------------delete----------------------
router.delete("/employer/:id", admincontroller.deleteEmployer);
router.delete("/jobseeker/:id", admincontroller.deleteJobSeeker);
router.delete("/jobseekers/:id", admincontroller.deleteJobSeeker);

module.exports = router;
