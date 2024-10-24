const TaxModel = require("./tax.model");
const stateModel = require("./state.model");
const districtModel = require("./district.model");

module.exports = {
  Tax: TaxModel,
  State: stateModel,
  District: districtModel,
};
