const express = require("express");
const router = express.Router();
const handler = require("../../controllers/resource/state.controller");
const verifyUser = require("../../../../middlewares/auth.middleware");

/**
 * @route   GET /states
 * @desc    Get all states
 */
router.get("/", verifyUser, handler.getStates);

/**
 * @route   POST /states
 * @desc    Create a new state
 */
router.post("/", verifyUser, handler.createState);

/**
 * @route   GET /states/:id
 * @desc    Get a state by ID
 */
router.get("/:id", verifyUser, handler.getStateById);

/**
 * @route   PUT /states/:id
 * @desc    Update a state by ID
 */
router.put("/:id", verifyUser, handler.updateState);

/**
 * @route   DELETE /states/:id
 * @desc    Delete a state by ID
 */
router.delete("/:id", verifyUser, handler.deleteState);

module.exports = router;
