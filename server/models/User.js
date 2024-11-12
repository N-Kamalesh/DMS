import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^\S+@\S+\.\S+$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    aadhar: {
      type: String,
      required: true,
      unique: true,
      match: /^\d{12}$/,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
      match: /^\d{10}$/,
    },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
