const {
  getTopCustomers,
  generateSaleReport,
  getTopSellingProducts,
} = require("../../services/analytics/report.service");

const { responseHandler } = require("../../../../handlers");
const { getDateRangeFromRequest } = require("../../../../utils/date.util");

const createReportHandler = (reportFunction) => {
  return async (req, res, next) => {
    try {
      const { storeId } = req.identifier;
      const searchQuery = getDateRangeFromRequest(req);
      const report = await reportFunction(storeId, searchQuery);
      responseHandler.sendSuccessResponse(res, report);
    } catch (error) {
      next(error);
    }
  };
};

const getSalesReport = createReportHandler(generateSaleReport);
const getTopCustomersReport = createReportHandler(getTopCustomers);
const getTopSellingProductsReport = createReportHandler(getTopSellingProducts);

module.exports = {
  getTopSellingProductsReport,
  getTopCustomersReport,
  getSalesReport,
};
