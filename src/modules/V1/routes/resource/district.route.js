const express = require("express");
const router = express.Router();
const districtController = require("../../controllers/resource/district.controller");

/**
 * @route   GET /districts
 * @desc    Get all districts
 */
router.get("/", districtController.getDistricts);

/**
 * @route   POST /districts
 * @desc    Create a new district
 */
router.post("/", districtController.createDistrict);

/**
 * @route   GET /districts/:id
 * @desc    Get a district by ID
 */
router.get("/:id", districtController.getDistrictById);

/**
 * @route   PUT /districts/:id
 * @desc    Update a district by ID
 */
router.put("/:id", districtController.updateDistrict);

/**
 * @route   DELETE /districts/:id
 * @desc    Delete a district by ID
 */
router.delete("/:id", districtController.deleteDistrict);

module.exports = router;
