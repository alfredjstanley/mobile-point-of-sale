const { State } = require("../../models/resource");

/**
 * Create a new state.
 * @param {Object} stateData - Data for the new state.
 * @returns {Promise<Object>} - The created state.
 */
async function createState(stateData) {
  // Check if a state with the same name or code already exists
  const existingState = await State.findOne({
    $or: [{ name: stateData.name }, { code: stateData.code }],
  });
  if (existingState) {
    throw new Error("State with this name or code already exists");
  }

  const state = new State({
    name: stateData.name,
    code: stateData.code,
    capital: stateData.capital,
    area: stateData.area,
  });

  return await state.save();
}

/**
 * Get all states.
 * @returns {Promise<Array>} - List of all states.
 */
async function getStates() {
  return await State.find();
}

/**
 * Get a state by ID.
 * @param {String} id - State ID.
 * @returns {Promise<Object>} - The found state.
 */
async function getStateById(id) {
  const state = await State.findById(id);
  if (!state) {
    throw new Error("State not found");
  }
  return state;
}

/**
 * Update a state by ID.
 * @param {String} id - State ID.
 * @param {Object} updateData - Data to update.
 * @returns {Promise<Object>} - The updated state.
 */
async function updateState(id, updateData) {
  // Check if updating name or code to an existing state
  if (updateData.name || updateData.code) {
    const existingState = await State.findOne({
      $or: [{ name: updateData.name }, { code: updateData.code }],
      _id: { $ne: id },
    });
    if (existingState) {
      throw new Error("State with this name or code already exists");
    }
  }

  const state = await State.findById(id);
  if (!state) {
    throw new Error("State not found");
  }

  Object.assign(state, updateData);
  return await state.save();
}

/**
 * Delete a state by ID.
 * @param {String} id - State ID.
 * @returns {Promise<void>}
 */
async function deleteState(id) {
  const state = await State.findById(id);
  if (!state) {
    throw new Error("State not found");
  }
  await State.deleteOne({ _id: id });
}

module.exports = {
  createState,
  getStates,
  getStateById,
  updateState,
  deleteState,
};
