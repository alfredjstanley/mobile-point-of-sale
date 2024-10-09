const Category = require("../models/category.model");

const categoryService = {
  // Create a new category
  async createCategory(categoryData) {
    const category = new Category(categoryData);
    await category.save();
    return {
      message: "Category created successfully",
      category,
    };
  },

  // Get all categories
  async getAllCategories() {
    return await Category.find();
  },

  // Update a category
  async updateCategory(categoryId, updateData) {
    const response = await Category.findByIdAndUpdate(categoryId, updateData, {
      new: true,
    });

    return {
      message: "Category updated",
      updatedCategory: response,
    };
  },
};

module.exports = categoryService;
