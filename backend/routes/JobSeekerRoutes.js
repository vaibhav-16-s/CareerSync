const express = require("express");
const router = express.Router();

const JobSeekerRoutes=require("../controllers/JobSeekerController")


// public route (anyone can search)
router.get("/searchjobs", JobSeekerRoutes.searchJobs);


module.exports = router;