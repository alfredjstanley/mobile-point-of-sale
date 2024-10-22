const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      maxlength: [25, "Username cannot be more than 25 characters"],
    },
    firstName: {
      type: String,
      trim: true,
      default: null,
      maxlength: [20, "First name cannot be more than 20 characters"],
    },
    lastName: {
      type: String,
      trim: true,
      default: null,
      maxlength: [20, "Last name cannot be more than 20 characters"],
    },
    gender: {
      type: String,
      default: "not-specified",
      enum: ["male", "female", "non-binary", "not-specified"],
    },
    avatar: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})$/,
        "Please enter a valid email",
      ],
      default: null,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    address: {
      city: { type: String, default: null },
      district: {
        type: String,
        default: null,
        type: mongoose.Schema.Types.ObjectId,
        ref: "District",
      },
      state: {
        type: String,
        default: null,
        type: mongoose.Schema.Types.ObjectId,
        ref: "State",
      },
      street: { type: String, default: null },
      postalCode: { type: String, default: null },
      country: { type: String, default: "IN" },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userProfileSchema.index({ email: 1 });
userProfileSchema.index({ username: 1 });

module.exports = mongoose.model("UserProfile", userProfileSchema);