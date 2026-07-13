import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ DB Connected Successfully");
  } catch (error) {
    console.log("❌ DB Connection Failed:", error.message);
    process.exit(1);
  }
};
