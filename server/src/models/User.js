import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    avatarUrl: { type: String },
    // later: password hash or OAuth provider id(s)
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
