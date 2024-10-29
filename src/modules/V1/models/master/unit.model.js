const mongoose = require("mongoose");
const initialunits = require("../../misc/migrations/initial/unit.migration");

const unitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    unitCode: {
      type: String,
      required: [true, "Unit code is required"],
      trim: true,
    },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      default: null,
    },
    description: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { versionKey: false }
);

unitSchema.index({ name: 1, storeId: 1, unitCode: 1 }, { unique: true });

const Unit = mongoose.model("Unit", unitSchema);

// Insert initial documents
(async () => {
  try {
    const count = await Unit.countDocuments({});
    if (count === 0) {
      await Unit.insertMany(initialunits);
      console.log("Initial 'Units' data migrated");
    }
  } catch (error) {
    console.error("Error inserting initial units:", error);
  }
})();

module.exports = Unit;
