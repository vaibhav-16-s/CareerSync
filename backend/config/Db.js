const mongoose = require ('mongoose');

async function connectDB() {
  try{
    await mongoose.connect(process.env.mongo_URI);
    console.log("MongoDB Connected Successfully");
  }
  catch(e){
    console.log("MongoDB connection failed!");
    console.log(e);
    process.exit(1);
  }
}

module.exports= connectDB;