const {
  generateSaleReport,
  getTopSellingProducts,
} = require("../../services/analytics/report.service");

const { responseHandler } = require("../../../../handlers");

const getSalesReport = async (req, res, next) => {
  try {
    const { storeId } = req.identifier;

    const today = new Date().toISOString().slice(0, 10);
    const fromDate = req.query.fromDate || today;
    const toDate = req.query.toDate || today;

    const searchQuery = {
      fromDate,
      toDate,
    };

    const report = await generateSaleReport(storeId, searchQuery);
    responseHandler.sendSuccessResponse(res, report);
  } catch (error) {
    next(error);
  }
};

const getTopSellingProductsReport = async (req, res, next) => {
  try {
    const { storeId } = req.identifier;

    const today = new Date().toISOString().slice(0, 10);
    const fromDate = req.query.fromDate || today;
    const toDate = req.query.toDate || today;

    const searchQuery = {
      fromDate,
      toDate,
    };

    const report = await getTopSellingProducts(storeId, searchQuery);
    responseHandler.sendSuccessResponse(res, report);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTopSellingProductsReport,
  getSalesReport,
};
