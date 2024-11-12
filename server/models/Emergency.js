import mongoose from "mongoose";

const emergencySchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      trim: true,
      lowercase: true,
    },
    photos: {
      type: [String],
      default: [],
    },
    location: {
      latitude: {
        type: Number,
        required: true,
        min: -90,
        max: 90,
      },
      longitude: {
        type: Number,
        required: true,
        min: -180,
        max: 180,
      },
    },
    description: {
      type: String,
      required: true,
      maxlength: 500,
      trim: true,
      minlength: 10,
    },
    acknowledgment: {
      accepts: {
        type: Number,
        default: 0,
        min: 0,
      },
      rejects: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    comments: [
      {
        email: {
          type: String,
          required: true,
          match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
          trim: true,
          lowercase: true,
        },
        message: {
          type: String,
          required: true,
          maxlength: 300,
          trim: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    acceptedUsers: {
      type: [String],
      default: [],
    },
    rejectedUsers: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Emergency = mongoose.model("Emergency", emergencySchema);
export default Emergency;
