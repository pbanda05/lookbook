import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI is not set in .env");

  mongoose.set("strictQuery", true);

  await mongoose.connect(uri, {
    // If you use a standard connection string with a db in it, no need to set dbName
    // dbName: "lookbook",
  });

  console.log("🗄️  MongoDB connected");
}
