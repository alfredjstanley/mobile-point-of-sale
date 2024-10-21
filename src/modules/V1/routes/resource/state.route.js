const express = require("express");
const router = express.Router();
const handler = require("../../controllers/resource/state.controller");
const authMiddleware = require("../../../../middlewares/auth.middleware");

/**
 * @route   GET /states
 * @desc    Get all states
 */
router.get("/", authMiddleware, handler.getStates);

/**
 * @route   POST /states
 * @desc    Create a new state
 */
router.post("/", authMiddleware, handler.createState);

/**
 * @route   GET /states/:id
 * @desc    Get a state by ID
 */
router.get("/:id", authMiddleware, handler.getStateById);

/**
 * @route   PUT /states/:id
 * @desc    Update a state by ID
 */
router.put("/:id", authMiddleware, handler.updateState);

/**
 * @route   DELETE /states/:id
 * @desc    Delete a state by ID
 */
router.delete("/:id", authMiddleware, handler.deleteState);

module.exports = router;
