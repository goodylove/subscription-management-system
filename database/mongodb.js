import mongoose from "mongoose";

import { DATABASE_URL, NODE_ENV } from "../config/env.js";

if (!DATABASE_URL) {
  throw new Error(
    "Please define the mongo url env variable in .env<production/development>.local"
  );
}

const connectToDataBase = async () => {
  try {
    await mongoose.connect(DATABASE_URL);
    console.log("Connected to Database in " + NODE_ENV + " mode");
  } catch (error) {
    console.log("Error connecting to  database", error);
    process.exit(1);
  }
};

export default connectToDataBase;
