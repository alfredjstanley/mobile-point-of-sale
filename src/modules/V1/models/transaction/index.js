const saleModel = require("./sales.model");
const taxTransactionModel = require("./taxTransaction.model");
const stockTransactionModel = require("./stockTransaction.model");
const accountTransactionModel = require("./accountTransaction.model");

module.exports = {
  Sale: saleModel,
  TaxTransaction: taxTransactionModel,
  StockTransaction: stockTransactionModel,
  AccountTransaction: accountTransactionModel,
};
