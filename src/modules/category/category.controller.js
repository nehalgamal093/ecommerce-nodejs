import slugify from "slugify";
import { categoryModel } from "../../../models/category.model.js";
import { AppError } from "../../../utils/AppError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";


const createCategory = catchAsyncError(async (req, res) => {
  const { name } = req.body;
  let result = new categoryModel({ name, slug: slugify(name) });
  await result.save();
  res.json({ message: "success", result });
});

const getAllCategories = catchAsyncError(async (req, res) => {
  let result = await categoryModel.find({});
  res.json({ message: "success", result });
});

const getCategory = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let result = await categoryModel.findById(id);
  !result && next(new AppError(`category not found ${req.originalUrl}`, 404));

  result && res.json({ message: "success", result });
});

const updateCategory = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  let result = await categoryModel.findByIdAndUpdate(id, {
    name,
    slug: slugify(name),
  },{new:true});
  !result && next(new AppError(`category not found ${req.originalUrl}`, 404));

  result && res.json({ message: "success", result });
});

const deleteCategory = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let result = await categoryModel.findByIdAndDelete(id);
  !result && next(new AppError(`category not found ${req.originalUrl}`, 404));

  result && res.json({ message: "success", result });
});

export {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  getCategory,
};
