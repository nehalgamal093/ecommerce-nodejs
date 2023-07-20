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

const categoryRouter = express.Router();
import multer from "multer";
import { AppError } from "../../../utils/AppError.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/category");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

function fileFilter(req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("images only", 400), false);
  }
}

const upload = multer({ storage, fileFilter });

categoryRouter.use("/:categoryId/subcategories", subCategoryRouter);
categoryRouter
  .route("/")
  .post(upload.single('image'),validation(createCategorySchema), createCategory)
  .get(getAllCategories);

categoryRouter
  .route("/:id")
  .get(validation(getCategorySchema), getCategory)
  .delete(deleteCategory)
  .put(validation(updateCategorySchema), updateCategory);

export default categoryRouter;
