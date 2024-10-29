const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Store",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
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

categorySchema.index({ name: 1, storeId: 1, code: 1 }, { unique: true });

categorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.code = this.name.trim().toLowerCase().replace(/\s+/g, "-");
  }
  next();
});

module.exports = mongoose.model("Category", categorySchema);
