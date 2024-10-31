const { Category } = require("../../models/master");

class CategoryService {
  async createCategory(data) {
    const existingCategory = await Category.findOne({
      name: data.name,
      storeId: data.storeId,
    });
    if (existingCategory) {
      throw new Error("Category with this name already exists");
    }

    const category = new Category(data);
    await category.save();

    return {
      message: "Category created successfully",
    };
  }

  async getCategories(filter = {}) {
    return await Category.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "category",
          as: "products",
          pipeline: [{ $project: { _id: 1 } }],
        },
      },
      {
        $addFields: {
          productCount: { $size: "$products" },
        },
      },
    ]);
  }

  async getCategoryById(id) {
    return await Category.findById(id);
  }

  async updateCategory(id, data) {
    const catogory = await Category.findByIdAndUpdate(id, data, { new: true });

    return {
      message: "Category updated",
      updatedCategory: catogory,
    };
  }

  async deleteCategory(id) {
    await Category.findByIdAndUpdate(id, {
      status: "INACTIVE",
    });

    return {
      message: "Category deleted successfully",
    };
  }
}

module.exports = new CategoryService();
