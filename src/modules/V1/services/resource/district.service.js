const District = require("../../models/resource/district.model");
const State = require("../../models/resource/state.model");

/**
 * Create a new district.
 * @param {Object} districtData - Data for the new district.
 * @returns {Promise<Object>} - The created district.
 */
async function createDistrict(districtData) {
  const state = await State.findOne({ name: districtData.stateName });
  if (!state) {
    throw new Error(`State not found: ${districtData.stateName}`);
  }

  const district = new District({
    name: districtData.name,
    code: districtData.code,
    state: state._id,
    population: districtData.population,
    area: districtData.area,
  });

  return await district.save();
}

/**
 * Get all districts.
 * @returns {Promise<Array>} - List of all districts.
 */
async function getDistricts() {
  return await District.find();
}

/**
 * Get all districts by state code.
 * @param {String} stateCode - State code.
 * @returns {Promise<Array>} - List of districts in the state.
 */
async function getDistrictsByStateCode(stateCode) {
  return await District.find({ stateCode });
}

/**
 * Get a district by ID.
 * @param {String} id - District ID.
 * @returns {Promise<Object>} - The found district.
 */
async function getDistrictById(id) {
  const district = await District.findById(id).populate(
    "stateCode",
    "name code"
  );
  if (!district) {
    throw new Error("District not found");
  }
  return district;
}

/**
 * Update a district by ID.
 * @param {String} id - District ID.
 * @param {Object} updateData - Data to update.
 * @returns {Promise<Object>} - The updated district.
 */
async function updateDistrict(id, updateData) {
  const district = await District.findById(id);
  if (!district) {
    throw new Error("District not found");
  }

  if (updateData.stateName) {
    const state = await State.findOne({ name: updateData.stateName });
    if (!state) {
      throw new Error(`State not found: ${updateData.stateName}`);
    }
    updateData.state = state._id;
    delete updateData.stateName;
  }

  Object.assign(district, updateData);
  return await district.save();
}

/**
 * Delete a district by ID.
 * @param {String} id - District ID.
 * @returns {Promise<void>}
 */
async function deleteDistrict(id) {
  const district = await District.findById(id);
  if (!district) {
    throw new Error("District not found");
  }
  await District.deleteOne({ _id: id });
}

module.exports = {
  getDistrictsByStateCode,
  getDistrictById,
  updateDistrict,
  deleteDistrict,
  createDistrict,
  getDistricts,
};
