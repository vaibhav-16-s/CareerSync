const express =require("express");
const HomeController=require("../controllers/HomeController");
const router=express.Router();
const upload = require("../middleware/Upload");

//-------------post----------
router.post('/login',HomeController.loginUser);
router.post('/jobseeker_register',upload.single("ProfilePic"),HomeController.JobSeekerReg);









module.exports=router;