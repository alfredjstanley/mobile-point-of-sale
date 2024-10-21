const { unitService } = require("../../services/master");

const responseHandler = require("../../../../handlers/response.handler");

const { getStoreId, getUserStoreIds } = require("../../services/auth.service");

class UnitController {
  async createUnit(req, res, next) {
    try {
      const data = req.body;
      const { storeId, userId } = await getUserStoreIds(req.identifier);

      data.storeId = storeId;
      data.createdBy = userId;

      const unit = await unitService.createUnit(data);

      responseHandler.sendCreatedResponse(res, unit);
    } catch (error) {
      next(error);
    }
  }

  async getUnits(req, res, next) {
    try {
      const { storeId } = await getStoreId(req.identifier);
      const units = await unitService.getUnits({
        storeId,
        status: "ACTIVE",
      });
      responseHandler.sendSuccessResponse(res, units);
    } catch (error) {
      next(error);
    }
  }

  async getUnitById(req, res, next) {
    try {
      const unitId = req.params.id;
      if (!unitId) {
        return responseHandler.sendFailureResponse(res, "Unit ID is required");
      }
      const unit = await unitService.getUnitById(unitId);
      if (!unit) {
        return responseHandler.sendNotFoundResponse(res, "Unit not found");
      }

      responseHandler.sendSuccessResponse(res, unit);
    } catch (error) {
      next(error);
    }
  }

  async updateUnit(req, res, next) {
    try {
      const data = req.body;

      const unitId = req.params.id;
      if (!unitId) {
        return responseHandler.sendFailureResponse(res, "Unit ID is required");
      }

      const { storeId } = await getStoreId(req.identifier);
      data.storeId = storeId;

      const unit = await unitService.updateUnit(unitId, data);

      responseHandler.sendSuccessResponse(res, unit);
    } catch (error) {
      next(error);
    }
  }

  async deleteUnit(req, res, next) {
    try {
      const unitId = req.params.id;
      if (!unitId) {
        return responseHandler.sendFailureResponse(res, "Unit ID is required");
      }

      const { storeId } = await getStoreId(req.identifier);

      await unitService.deleteUnit(unitId, storeId);

      responseHandler.sendSuccessResponse(
        res,
        null,
        "Unit deleted successfully"
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UnitController();
