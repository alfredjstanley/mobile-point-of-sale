const mongoose = require("mongoose");
const initialdistricts = require("../../misc/migrations/initial/district.migration");

const districtSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      trim: true,
    },
    stateCode: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "State",
    },
    area: Number,
  },
  {
    versionKey: false,
  }
);

const District = mongoose.model("District", districtSchema);

// Insert initial documents
(async () => {
  try {
    const count = await District.countDocuments({});
    if (count === 0) {
      await District.insertMany(initialdistricts);
      console.log("Initial 'Districts' data migrated");
    }
  } catch (error) {
    console.error("Error inserting initial districts:", error);
  }
})();

module.exports = District;
