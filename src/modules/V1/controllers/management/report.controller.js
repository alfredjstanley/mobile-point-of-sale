const reportService = require("../../services/management/report.service");

const { responseHandler } = require("../../../../handlers");
const { getDateRangeFromRequest } = require("../../../../utils/date.util");

class ReportController {
  async getBillReport(req, res, next) {
    try {
      const { storeId } = req.identifier;
      const searchQuery = getDateRangeFromRequest(req);
      const report = await reportService.generateBillReport(
        storeId,
        searchQuery
      );
      responseHandler.sendSuccessResponse(res, report);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ReportController();