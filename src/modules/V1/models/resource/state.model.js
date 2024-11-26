const mongoose = require("mongoose");
const initialStates = require("../../misc/migrations/initial/state.migration");

const stateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      minlength: 2,
      maxlength: 3,
    },
    capital: {
      type: String,
      required: true,
      trim: true,
    },
    area: {
      type: Number,
      comment: "Area of the state in square kilometers",
    },
  },
  {
    versionKey: false,
  }
);

const State = mongoose.model("State", stateSchema);

// Insert initial documents
(async () => {
  try {
    const count = await State.countDocuments({});
    if (count === 0) {
      await State.insertMany(initialStates);
      console.info("Initial 'States' data migrated");
    }
  } catch (error) {
    console.error("Error inserting initial states:", error);
  }
})();

module.exports = State;
