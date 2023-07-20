import slugify from "slugify";
import { brandModel } from "../../../models/brand.model.js";
import { AppError } from "../../../utils/AppError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import * as factory from "../handlers/factor.handler.js";
import { ApiFeatures } from "../../../utils/ApiFeatures.js";


const createBrand = catchAsyncError(async (req, res) => {
  const { name } = req.body;
  let result = new brandModel({ name, slug: slugify(name) });
  await result.save();
  res.json({ message: "success", result });
});

const getAllBrands = catchAsyncError(async (req, res) => {
  let apiFeatures = new ApiFeatures(brandModel.find(), req.query)
    .paginate()
    .fields()
    .filter()
    .sort()
    .search();

  //execute query
  let result = await apiFeatures.mongooseQuery;
  res.json({ message: "success",page: apiFeatures.page, result });
});

const getBrand = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let result = await brandModel.findById(id);
  !result && next(new AppError(`Brand not found ${req.originalUrl}`, 404));

  result && res.json({ message: "success", result });
});

const updateBrand = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  let result = await brandModel.findByIdAndUpdate(id, {
    name,
    slug: slugify(name),
  },{new:true});
  !result && next(new AppError(`Brand not found ${req.originalUrl}`, 404));

  result && res.json({ message: "success", result });
});

const deleteBrand = factory.deleteOne(brandModel)

export {
  createBrand,
  getAllBrands,
  updateBrand,
  deleteBrand,
  getBrand,
};
