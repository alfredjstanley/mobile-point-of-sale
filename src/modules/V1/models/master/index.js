const unitModel = require("./unit.model");
const productModel = require("./product.model");
const accountModel = require("./account.model");
const categoryModel = require("./category.model");

module.exports = {
  Unit: unitModel,
  Account: accountModel,
  Product: productModel,
  Category: categoryModel,
};
