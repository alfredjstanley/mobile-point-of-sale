const mongoose = require("mongoose");
const initialTaxes = require("../../misc/migrations/initial/tax.migration");

const taxSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    rate: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    versionKey: false,
  }
);

const Tax = mongoose.model("Tax", taxSchema);

// Insert initial documents
(async () => {
  try {
    const count = await Tax.countDocuments({});
    if (count === 0) {
      await Tax.insertMany(initialTaxes);
      console.log("Initial 'Taxes' data migrated");
    }
  } catch (error) {
    console.error("Error inserting initial taxes:", error);
  }
})();

module.exports = Tax;
