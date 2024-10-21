const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
    },
    code: {
      type: String,
      required: [true, "Category code is required"],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Store",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      requred: true,
      ref: "AuthUser",
    },
    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuthUser",
      default: null,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

categorySchema.post("save", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    // custom error based on the duplicate key
    if (error.keyPattern.name) {
      next(new Error("A category with this name already exists."));
    } else if (error.keyPattern.code) {
      next(new Error("A category with this code already exists."));
    } else {
      next(error);
    }
  } else {
    next(error);
  }
});

module.exports = mongoose.model("Category", categorySchema);
