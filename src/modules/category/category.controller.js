import slugify from "slugify";
import { categoryModel } from "../../../models/category.model.js";
import { AppError } from "../../../utils/AppError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import { ApiFeatures } from "../../../utils/ApiFeatures.js";

const createCategory = catchAsyncError(async (req, res, next) => {
  req.body.slug = slugify(req.body.name);

  let result = new categoryModel(req.body);
  await result.save();
  res.status(201).json({ message: "success", result });
});

const getAllCategories = catchAsyncError(async (req, res) => {
  let apiFeatures = new ApiFeatures(categoryModel.find(), req.query)
    .paginate()
    .fields()
    .filter()
    .sort()
    .search();

  //execute query
  let result = await apiFeatures.mongooseQuery;
  res.json({ message: "success", page: apiFeatures.page, result });
});

const getCategory = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let result = await categoryModel.findById(id);
  !result && next(new AppError(`category not found ${req.originalUrl}`, 404));

  result && res.json({ message: "success", result });
});

const updateCategory = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  req.body.slug = slugify(req.body.name);

  let result = await categoryModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
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
