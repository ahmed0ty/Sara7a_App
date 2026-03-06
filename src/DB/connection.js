

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL,{
        serverSelectionTimeoutMS:5000,
    }); 
    console.log("Database connected successfully");
  } catch (error) {
    console.log(`Error connecting to the database: ${error}`);
  }
};

export default connectDB;