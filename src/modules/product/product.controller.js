import slugify from "slugify";
import { productModel } from "../../../models/product.model.js";
import { AppError } from "../../../utils/AppError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";


const createProduct = catchAsyncError(async (req, res) => {
  
  req.body.slug = slugify(req.body.title)
  let result = new productModel(req.body);
  await result.save();
  res.json({ message: "success", result });
});

const getAllProducts= catchAsyncError(async (req, res) => {
  let result = await productModel.find({});
  res.json({ message: "success", result });
});

const getProduct = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let result = await productModel.findById(id);
  !result && next(new AppError(`Product not found ${req.originalUrl}`, 404));

  result && res.json({ message: "success", result });
});

const updateProduct = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  if(req.body.name) req.body.slug = slugify(req.body.title)
  let result = await productModel.findByIdAndUpdate(id, req.body,{new:true});
  !result && next(new AppError(`Product not found ${req.originalUrl}`, 404));

  result && res.json({ message: "success", result });
});

const deleteProduct = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let result = await productModel.findByIdAndDelete(id);
  !result && next(new AppError(`Product not found ${req.originalUrl}`, 404));

  result && res.json({ message: "success", result });
});

export {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProduct,
};
