const express = require("express");
const router = express.Router();
const handler = require("../../controllers/resource/tax.controller");
const authMiddleware = require("../../../../middlewares/auth.middleware");

/**
 * @route   GET /states
 * @desc    Get all states
 */
router.get("/", authMiddleware, handler.getTaxes);

/**
 * @route   POST /states
 * @desc    Create a new state
 */
router.post("/", authMiddleware, handler.createTax);

/**
 * @route   GET /states/:id
 * @desc    Get a state by ID
 */
router.get("/:id", authMiddleware, handler.getTaxById);

/**
 * @route   PUT /states/:id
 * @desc    Update a state by ID
 */
router.put("/:id", authMiddleware, handler.updateTax);

/**
 * @route   DELETE /states/:id
 * @desc    Delete a state by ID
 */
router.delete("/:id", authMiddleware, handler.deleteTax);

module.exports = router;
