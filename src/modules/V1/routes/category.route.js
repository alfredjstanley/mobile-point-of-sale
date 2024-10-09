const categoryRouter = require("express").Router();
const handler = require("../controllers/category.controller");

categoryRouter.post("/", handler.createCategory);
categoryRouter.get("/", handler.getAllCategories);

module.exports = categoryRouter;
