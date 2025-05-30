import slugify from "slugify";
import { subCategoryModel } from "../../../models/subcategory.model.js";
import { AppError } from "../../../utils/AppError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import cloudinary from "../../../config/cloudinary.js";
const createSubCategory = catchAsyncError(async (req, res) => {
  const { name, category } = req.body;
  let result = new subCategoryModel({
    name,
    category,
    slug: slugify(name),
    image: (await cloudinary.uploader.upload(req.files[0].path)).secure_url,
    cloudinary_id: (await cloudinary.uploader.upload(req.files[0].path))
      .public_id,
  });
  await result.save();
  res.json({ message: "success", result });
});

const getAllSubCategories = catchAsyncError(async (req, res) => {
  let filter = {};
  if (req.params.categoryId) {
    filter = { category: req.params.categoryId };
  }
  let result = await subCategoryModel.find(filter);
  res.json({ message: "success", result });
});

const getSubCategory = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let result = await subCategoryModel.findById(id);
  !result &&
    next(new AppError(`subcategory not found ${req.originalUrl}`, 404));

  result && res.json({ message: "success", result });
});

const updateSubCategory = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;
  let result = await subCategoryModel.findByIdAndUpdate(
    id,
    {
      name,
      category,
      slug: slugify(name),
    },
    { new: true }
  );
  !result &&
    next(new AppError(`subcategory not found ${req.originalUrl}`, 404));

  result && res.json({ message: "success", result });
});

const deleteSubCategory = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let result = await subCategoryModel.findByIdAndDelete(id);
  !result &&
    next(new AppError(`subcategory not found ${req.originalUrl}`, 404));

  result && res.json({ message: "success", result });
});

export {
  createSubCategory,
  getAllSubCategories,
  updateSubCategory,
  deleteSubCategory,
  getSubCategory,
};
