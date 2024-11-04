const {
  generateSaleReport,
} = require("../../services/analytics/report.service");

const { responseHandler } = require("../../../../handlers");

const getSalesReport = async (req, res, next) => {
  try {
    const { storeId } = req.identifier;
    const report = await generateSaleReport(storeId);
    responseHandler.sendSuccessResponse(res, report);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSalesReport,
};
