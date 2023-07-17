import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
  updateCategory,
} from "./category.controller.js";

const categoryRouter = express.Router();

categoryRouter.route("/").post(createCategory).get(getAllCategories);

categoryRouter
  .route("/:id")
  .get(getCategory)
  .delete(deleteCategory)
  .put(updateCategory);

export default categoryRouter;
