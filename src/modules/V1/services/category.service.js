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

  // Get a category by ID
  async getCategoryById(categoryId) {
    return await Category.findById(categoryId);
  },

  // Update a category
  async updateCategory(categoryId, updateData) {
    return await Category.findByIdAndUpdate(categoryId, updateData, {
      new: true,
    });
  },

  // Delete a category
  async deleteCategory(categoryId) {
    return await Category.findByIdAndDelete(categoryId);
  },
};

module.exports = categoryService;
