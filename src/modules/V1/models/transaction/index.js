const saleModel = require("./sales.model");
const quickSaleModel = require("./quickSale.model");
const saveOrderModel = require("./savedOrder.model");

const purchaseModel = require("./purchase.model");
const taxTransactionModel = require("./taxTransaction.model");
const stockTransactionModel = require("./stockTransaction.model");
const accountTransactionModel = require("./accountTransaction.model");

module.exports = {
  Sale: saleModel,
  QuickSale: quickSaleModel,
  SavedOrder: saveOrderModel,

  Purchase: purchaseModel,
  TaxTransaction: taxTransactionModel,
  StockTransaction: stockTransactionModel,
  AccountTransaction: accountTransactionModel,
};
