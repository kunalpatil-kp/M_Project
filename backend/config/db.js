import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb://kunalpatil56568_db_user:Sergio111@ac-4csnzuz-shard-00-00.xetjgs0.mongodb.net:27017,ac-4csnzuz-shard-00-01.xetjgs0.mongodb.net:27017,ac-4csnzuz-shard-00-02.xetjgs0.mongodb.net:27017/?ssl=true&replicaSet=atlas-6p7nls-shard-0&authSource=admin&appName=food-delivery",
    );
    console.log("✅ DB Connected Successfully");
  } catch (error) {
    console.log("❌ DB Connection Failed:", error.message);
    process.exit(1);
  }
};
