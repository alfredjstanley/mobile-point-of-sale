const mongoose = require("mongoose");
const initialStoreTypes = require("../../misc/migrations/initial/storeType.migration");

const StoreTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
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
  {
    versionKey: false,
  }
);

const StoreType = mongoose.model("StoreType", StoreTypeSchema);

// Insert initial documents
(async () => {
  try {
    const count = await StoreType.countDocuments({});
    if (count === 0) {
      await StoreType.insertMany(initialStoreTypes);
      console.log("Initial 'StoreTypes' data migrated");
    }
  } catch (error) {
    console.error("Error inserting initial 'StoreType':", error);
  }
})();

module.exports = StoreType;
