const mongoose = require("mongoose");

const districtSchema = new mongoose.Schema(
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

module.exports = District;
