import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, unique: true, required: true },
    name: { type: String, trim: true, required: true },
    email: { type: String, trim: true, lowercase: true, required: true },
    avatarUrl: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
