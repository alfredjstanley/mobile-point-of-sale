const mongoose = require("mongoose");

const userAuthSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      unique: true,
      required: [true, "Phone number is required"],
      match: [/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"],
    },
    mPinHash: {
      type: String,
      required: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    secretOrKey: {
      type: String,
      required: true,
    },
    mPinResetToken: {
      type: String,
    },
    role: {
      type: String,
      required: true,
      enum: ["Super-Admin", "Admin", "Staff", "Normal"],
    },
    status: {
      type: String,
      default: "Pending",
      enum: ["Active", "Pending", "Disabled", "Blocked"],
    },
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserProfile",
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform(_, ret) {
        delete ret.secretOrKey;
        delete ret.passwordHash;
        delete ret.passwordResetToken;
        return ret;
      },
    },
  }
);

userAuthSchema.index({ secretOrKey: 1 });
userAuthSchema.index({ phoneNumber: 1 });

module.exports = mongoose.model("UserAuth", userAuthSchema);
