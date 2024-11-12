import mongoose from "mongoose";

const Notification = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  timestamps: true,
});
