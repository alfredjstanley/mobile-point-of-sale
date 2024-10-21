const mongoose = require("mongoose");
const UserProfile = require("../models/userProfile.model");

const authUserSchema = new mongoose.Schema(
  {
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    userProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserProfile",
      required: true,
    },
    phoneNumber: {
      type: String,
      unique: true,
      required: [true, "Phone number is required"],
    },
    mPinHash: {
      required: true,
      type: String,
    },
    secretOrKey: {
      type: String,
      unique: true,
      required: true,
    },
    mPinResetToken: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      required: true,
      enum: ["Administrator", "Staff", "Normal"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuthUser",
      default: null,
    },
    status: {
      type: String,
      required: true,
      enum: ["ACTIVE", "INACTIVE", "PENDING", "SUSPENDED"],
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    loginCount: {
      type: Number,
      default: 0,
    },
    mustChangePin: {
      type: Boolean,
      default: true,
    },
    loginHistory: [
      {
        loginAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform(_, ret) {
        delete ret.mPinHash;
        delete ret.secretOrKey;
        delete ret.mustChangePin;
        delete ret.mPinResetToken;
        return ret;
      },
    },
  }
);

authUserSchema.pre("validate", async function (next) {
  if (this.isNew && !this.userProfile) {
    try {
      const userProfile = await UserProfile.create({
        username: this.phoneNumber,
      });
      this.userProfile = userProfile._id;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

authUserSchema.index({ secretOrKey: 1 });

authUserSchema.methods.recordLogin = function () {
  this.lastLoginAt = new Date();
  this.loginCount += 1;
  this.loginHistory.push({
    loginAt: new Date(),
  });

  // Limit history to the last 10 entries
  if (this.loginHistory.length > 10) {
    this.loginHistory.shift();
  }

  return this.save();
};

module.exports = mongoose.model("AuthUser", authUserSchema);
