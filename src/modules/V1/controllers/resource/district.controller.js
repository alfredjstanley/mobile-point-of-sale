const { districtService } = require("../../services/resource");
const { responseHandler } = require("../../../../handlers");
const { DistrictDTO } = require("../../dtos/resource");

/**
 * Controller to handle creating a new district.
 */
async function createDistrict(req, res, next) {
  try {
    const districtData = req.body;
    const district = await districtService.createDistrict(districtData);
    responseHandler.sendCreatedResponse(res, district, DistrictDTO);
  } catch (err) {
    next(err);
  }
}

/**
 * Controller to handle fetching all districts.
 */
async function getDistricts(req, res, next) {
  try {
    const districts = await districtService.getDistricts();
    responseHandler.sendSuccessResponse(res, districts, DistrictDTO);
  } catch (err) {
    next(err);
  }
}

/**
 * Controller to handle fetching a district by ID.
 */
async function getDistrictById(req, res, next) {
  try {
    const district = await districtService.getDistrictById(req.params.id);
    responseHandler.sendSuccessResponse(res, district, DistrictDTO);
  } catch (err) {
    next(err);
  }
}

/**
 * Controller to handle updating a district by ID.
 */
async function updateDistrict(req, res, next) {
  try {
    const district = await districtService.updateDistrict(
      req.params.id,
      req.body
    );
    responseHandler.sendSuccessResponse(res, district, DistrictDTO);
  } catch (err) {
    next(err);
  }
}

/**
 * Controller to handle deleting a district by ID.
 */
async function deleteDistrict(req, res, next) {
  try {
    await districtService.deleteDistrict(req.params.id);
    responseHandler.sendNoContentResponse(res);
  } catch (err) {
    next(err);
  }
}

/**
 * Controller to handle fetching all districts in a state.
 */
async function getDistrictsByStateCode(req, res, next) {
  try {
    const districts = await districtService.getDistrictsByStateCode(
      req.params.id
    );
    responseHandler.sendSuccessResponse(res, districts, DistrictDTO);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getDistricts,
  createDistrict,
  updateDistrict,
  deleteDistrict,
  getDistrictById,
  getDistrictsByStateCode,
};
