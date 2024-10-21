const { stateService } = require("../../services/resource");

/**
 * Controller to handle creating a new state.
 */
async function createState(req, res) {
  try {
    const state = await stateService.createState(req.body);
    res.status(201).json(state);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

/**
 * Controller to handle fetching all states.
 */
async function getStates(req, res) {
  try {
    const states = await stateService.getStates();
    res.json(states);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * Controller to handle fetching a state by ID.
 */
async function getStateById(req, res) {
  try {
    const state = await stateService.getStateById(req.params.id);
    res.json(state);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

/**
 * Controller to handle updating a state by ID.
 */
async function updateState(req, res) {
  try {
    const state = await stateService.updateState(req.params.id, req.body);
    res.json(state);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

/**
 * Controller to handle deleting a state by ID.
 */
async function deleteState(req, res) {
  try {
    await stateService.deleteState(req.params.id);
    res.json({ message: "State deleted successfully" });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

module.exports = {
  createState,
  getStates,
  getStateById,
  updateState,
  deleteState,
};
