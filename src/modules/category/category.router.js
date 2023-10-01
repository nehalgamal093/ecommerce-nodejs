import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
  updateCategory,
} from "./category.controller.js";
import subCategoryRouter from "../subcategory/subcategory.router.js";
import {
  createCategorySchema,
  getCategorySchema,
  updateCategorySchema,
} from "./category.validation.js";
import { validation } from "../../middleware/validation.js";
import { imageCoverUpload } from "../uploads/imageUpload.js";
const categoryRouter = express.Router();

categoryRouter.use("/:categoryId/subcategories", subCategoryRouter);
// categoryRouter
//   .route("/")
//   .post(uploadSingleFile('image','category'),validation(createCategorySchema), createCategory)
//   .get(getAllCategories);

// categoryRouter
//   .route("/:id")
//   .get(validation(getCategorySchema), getCategory)
//   .delete(deleteCategory)
//   .put(uploadSingleFile('image','category'),validation(updateCategorySchema), updateCategory);

categoryRouter
  .route("/")
  .post(imageCoverUpload, validation(createCategorySchema), createCategory)
  .get(getAllCategories);

categoryRouter
  .route("/:id")
  .get(validation(getCategorySchema), getCategory)
  .delete(deleteCategory)
  .put(validation(updateCategorySchema), updateCategory);
export default categoryRouter;
