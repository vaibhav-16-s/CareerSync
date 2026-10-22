const mongoose=require("mongoose");

const AdminSchema=new mongoose.Schema({
    Name:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        unique:true,
        required:true
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
        default:"Admin",
    },
    ProfilePic:{
        type:String,
        default:"default.png"
    }
})
module.exports=mongoose.model("Admin",AdminSchema);