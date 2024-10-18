const express = require("express");
const router = express.Router();
const handler = require("../../controllers/resource/district.controller");

const verifyUser = require("../../../../middlewares/auth.middleware");

/**
 * @route   GET /districts
 * @desc    Get all districts
 */
router.get("/", verifyUser, handler.getDistricts);

/**
 * @route   POST /districts
 * @desc    Create a new district
 */
router.post("/", verifyUser, handler.createDistrict);

/**
 * @route   GET /districts/state/:stateCode
 * @desc    Get all districts in a state
 */
router.get("/state/:id", verifyUser, handler.getDistrictsByStateCode);

/**
 * @route   GET /districts/:id
 * @desc    Get a district by ID
 */
router.get("/:id", verifyUser, handler.getDistrictById);

/**
 * @route   PUT /districts/:id
 * @desc    Update a district by ID
 */
router.put("/:id", verifyUser, handler.updateDistrict);

/**
 * @route   DELETE /districts/:id
 * @desc    Delete a district by ID
 */
router.delete("/:id", verifyUser, handler.deleteDistrict);

module.exports = router;
