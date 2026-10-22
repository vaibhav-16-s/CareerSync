const mongoose=require("mongoose");

const EmployerSchema=new mongoose.Schema({
    Name:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        unique:true,
        required:true
    },
    Website:{
        type:String,
        required:true,
        unique:true,
    },
    Contact:{
        type:String,
        required:true
    },
    Address:{
        type:String,
        required:true
    },
    Role:{
        type:String,
        default:"Employer",
    },
    ProfilePic:{
        type:String,
        default:"default.png"
    }
})
module.exports=mongoose.model("Employer",EmployerSchema);