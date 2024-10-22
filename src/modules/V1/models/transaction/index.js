const saleModel = require("./sales.model");
const purchaseModel = require("./purchase.model");
const taxTransactionModel = require("./taxTransaction.model");
const stockTransactionModel = require("./stockTransaction.model");
const accountTransactionModel = require("./accountTransaction.model");

module.exports = {
  Sale: saleModel,
  Purchase: purchaseModel,
  TaxTransaction: taxTransactionModel,
  StockTransaction: stockTransactionModel,
  AccountTransaction: accountTransactionModel,
};
