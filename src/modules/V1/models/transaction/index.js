const saleModel = require("./sales.model");
const quickSaleModel = require("./quickSale.model");
const hybridSaleModel = require("./hybridSale.model");

const purchaseModel = require("./purchase.model");
const taxTransactionModel = require("./taxTransaction.model");
const stockTransactionModel = require("./stockTransaction.model");
const accountTransactionModel = require("./accountTransaction.model");

module.exports = {
  Sale: saleModel,
  QuickSale: quickSaleModel,
  HybridSale: hybridSaleModel,

  Purchase: purchaseModel,
  TaxTransaction: taxTransactionModel,
  StockTransaction: stockTransactionModel,
  AccountTransaction: accountTransactionModel,
};
