const { Product } = require("../../models/master");

class ProductService {
  async createProduct(productData) {
    const product = new Product(productData);
    await product.save();
    return {
      message: "Product created successfully",
      product,
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

  async updateProduct(id, data) {
    const result = await Product.findByIdAndUpdate(id, data, { new: true });

    return {
      message: "Product updated",
      updatedProduct: result,
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
