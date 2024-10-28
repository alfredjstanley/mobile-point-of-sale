const { stateService } = require("../../services/resource");
const { responseHandler } = require("../../../../handlers");
const { StateDTO } = require("../../dtos/resource");

/**
 * Controller to handle creating a new state.
 */
async function createState(req, res, next) {
  try {
    const state = await stateService.createState(req.body);
    responseHandler.sendCreatedResponse(res, state, StateDTO);
  } catch (err) {
    next(err);
  }
}

/**
 * Controller to handle fetching all states.
 */
async function getStates(req, res, next) {
  try {
    const states = await stateService.getStates();
    responseHandler.sendSuccessResponse(res, states, StateDTO);
  } catch (err) {
    next(err);
  }
}

/**
 * Controller to handle fetching a state by ID.
 */
async function getStateById(req, res, next) {
  try {
    const state = await stateService.getStateById(req.params.id);
    responseHandler.sendSuccessResponse(res, state, StateDTO);
  } catch (err) {
    next(err);
  }
}

/**
 * Controller to handle updating a state by ID.
 */
async function updateState(req, res, next) {
  try {
    const state = await stateService.updateState(req.params.id, req.body);
    responseHandler.sendSuccessResponse(res, state, StateDTO);
  } catch (err) {
    next(err);
  }
}

/**
 * Controller to handle deleting a state by ID.
 */
async function deleteState(req, res) {
  try {
    await stateService.deleteState(req.params.id);
    responseHandler.sendNoContentResponse(res);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createState,
  getStates,
  getStateById,
  updateState,
  deleteState,
};
