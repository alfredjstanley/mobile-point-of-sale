const { Sale } = require("../../models/transaction");
const { Product } = require("../../models/master");
const { Tax } = require("../../models/resource");

class ProductService {
  async createProduct(productData) {
    if (productData.tax == "GST-0") {
      const tax = await Tax.findOne({ name: "GST-0" });
      productData.tax = tax._id;
    }
    const product = new Product(productData);
    await product.save();
    return {
      message: "Product created successfully",
    };
  }

  async getProducts(filter = {}) {
    return await Product.find(filter, { storeId: 0 })
      .lean()
      .populate("category unit tax");
  }

  async getProductById(id) {
    return await Product.findById(id);
  }

  async getProductsByCategory(categoryId) {
    return await Product.find({ category: categoryId, status: "ACTIVE" })
      .lean()
      .populate("category unit tax");
  }

  async updateProduct(id, data) {
    await Product.findByIdAndUpdate(id, data);

    return {
      message: "Product updated",
    };
  }

  async deleteProduct(id) {
    // Check if any sale is associated with the product
    const isSaleExists = await Sale.exists({
      "saleDetails.item": id,
    });

    if (isSaleExists) {
      return {
        message: "Product cannot be deleted as it is associated with a sale",
      };
    }
    await Product.findByIdAndUpdate(id, {
      status: "INACTIVE",
    });

    return {
      message: "Product deleted successfully",
    };
  }
}

module.exports = new ProductService();
