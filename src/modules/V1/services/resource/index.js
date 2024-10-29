const taxService = require("./tax.service");
const stateService = require("./state.service");
const districtService = require("./district.service");
const storeTypeService = require("./storeType.service");

module.exports = {
  taxService,
  stateService,
  districtService,
  StoreTypeService: storeTypeService,
};
