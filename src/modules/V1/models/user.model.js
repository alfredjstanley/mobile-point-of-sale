const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [20, "First name cannot be more than 20 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [20, "Last name cannot be more than 20 characters"],
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "non-binary", "not-specified"],
    },
    username: {
      type: String,
      required: [true, "username is required"],
      unique: true,
      maxlength: [20, "username cannot be more than 25 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
      lowercase: true,
      match: [
        /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        "Please enter a valid email",
      ],
    },
    role: {
      type: String,
      required: true,
      enum: ["Super-Admin", "Admin", "Staff", "Normal"],
    },
    avatar: {
      type: String,
    },
    secretOrKey: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["ACTIVE", "INACTIVE", "BLOCKED", "PENDING"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform(_, ret) {
        delete ret.secretOrKey;
        delete ret.updatedAt;
        delete ret._id;

        return ret;
      },
    },
  }
);

// index on the most used fields.
userSchema.index({ username: 1 });
userSchema.index({ secretOrKey: 1 });

module.exports = mongoose.model("User", userSchema);
