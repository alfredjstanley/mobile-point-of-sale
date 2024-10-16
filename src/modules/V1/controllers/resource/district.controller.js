const districtService = require("../../services/resource/district.service");

/**
 * Controller to handle creating a new district.
 */
async function createDistrict(req, res) {
  try {
    const district = await districtService.createDistrict(req.body);
    res.status(201).json(district);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

/**
 * Controller to handle fetching all districts.
 */
async function getDistricts(req, res) {
  try {
    const districts = await districtService.getDistricts();
    res.json(districts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * Controller to handle fetching a district by ID.
 */
async function getDistrictById(req, res) {
  try {
    const district = await districtService.getDistrictById(req.params.id);
    res.json(district);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

/**
 * Controller to handle updating a district by ID.
 */
async function updateDistrict(req, res) {
  try {
    const district = await districtService.updateDistrict(
      req.params.id,
      req.body
    );
    res.json(district);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

/**
 * Controller to handle deleting a district by ID.
 */
async function deleteDistrict(req, res) {
  try {
    await districtService.deleteDistrict(req.params.id);
    res.json({ message: "District deleted successfully" });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

module.exports = {
  createDistrict,
  getDistricts,
  getDistrictById,
  updateDistrict,
  deleteDistrict,
};
