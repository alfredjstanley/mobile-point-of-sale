const express = require("express");
const router = express.Router();
const stateController = require("../../controllers/resource/state.controller");

/**
 * @route   GET /states
 * @desc    Get all states
 */
router.get("/", stateController.getStates);

/**
 * @route   POST /states
 * @desc    Create a new state
 */
router.post("/", stateController.createState);

/**
 * @route   GET /states/:id
 * @desc    Get a state by ID
 */
router.get("/:id", stateController.getStateById);

/**
 * @route   PUT /states/:id
 * @desc    Update a state by ID
 */
router.put("/:id", stateController.updateState);

/**
 * @route   DELETE /states/:id
 * @desc    Delete a state by ID
 */
router.delete("/:id", stateController.deleteState);

module.exports = router;
