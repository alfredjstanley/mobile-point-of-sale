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
      enum: ["Super-Admin", "Administrator", "Staff", "Normal"],
    },
    status: {
      type: String,
      required: true,
      enum: ["Active", "Pending", "Disabled", "Blocked"],
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
