const { Product } = require("../../models/master");

class ProductService {
  async createProduct(productData) {
    const product = new Product(productData);
    await product.save();
    return {
      message: "Product created successfully",
    };
  }

  async getProducts(filter = {}) {
    return await Product.find(filter, { storeId: 0 }).populate(
      "category unit tax"
    );
  }

  async getProductById(id) {
    return await Product.findById(id);
  }

  async getProductsByCategory(categoryId) {
    return await Product.find({ category: categoryId });
  }

  async updateProduct(id, data) {
    await Product.findByIdAndUpdate(id, data);

    return {
      message: "Product updated",
    };
  }

  async deleteProduct(id) {
    await Product.findByIdAndUpdate(id, {
      status: "INACTIVE",
    });

    return {
      message: "Product deleted successfully",
    };
  }
}

module.exports = new ProductService();
