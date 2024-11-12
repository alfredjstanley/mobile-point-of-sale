const saleModel = require("./sales.model");
const quickSaleModel = require("./quickSale.model");

const purchaseModel = require("./purchase.model");
const creditPaymentModel = require("./creditPayment.model");
const taxTransactionModel = require("./taxTransaction.model");
const stockTransactionModel = require("./stockTransaction.model");
const accountTransactionModel = require("./accountTransaction.model");

module.exports = {
  Sale: saleModel,
  QuickSale: quickSaleModel,

  Purchase: purchaseModel,
  CreditPayment: creditPaymentModel,
  TaxTransaction: taxTransactionModel,
  StockTransaction: stockTransactionModel,
  AccountTransaction: accountTransactionModel,
};
