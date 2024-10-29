const TaxModel = require("./tax.model");
const stateModel = require("./state.model");
const districtModel = require("./district.model");
const storeTypeModel = require("./storeType.model");

module.exports = {
  Tax: TaxModel,
  State: stateModel,
  District: districtModel,
  StoreType: storeTypeModel,
};
