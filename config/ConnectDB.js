import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const ConnectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("Database Connected");
};

export default ConnectDB;
