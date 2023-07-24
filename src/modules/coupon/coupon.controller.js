import {couponModel} from '../../../models/coupon.model.js'
import { AppError } from "../../../utils/AppError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import * as factory from "../handlers/factor.handler.js";
import { ApiFeatures } from "../../../utils/ApiFeatures.js";
import qrcode from 'qrcode';


const createCoupon = catchAsyncError(async (req, res, next) => {

  let result = new couponModel(req.body);
  await result.save();
  res.json({ message: "success", result, result });
});

const getAllCoupons = catchAsyncError(async (req, res) => {
  let apiFeatures = new ApiFeatures(couponModel.find(), req.query)
    .paginate()
    .fields()
    .filter()
    .sort()
    .search();

  //execute query
  let result = await apiFeatures.mongooseQuery;
  res.json({ message: "success", page: apiFeatures.page, result });
});

const getCoupon= catchAsyncError(async (req, res, next) => {
    
  const { id } = req.params;
  let result = await couponModel.findById(id);
  let url = await qrcode.toDataURL(result.code)
  !result && next(new AppError(`Reviewnot found ${req.originalUrl}`, 404));

  result && res.json({ message: "success", result,url });
});
//need fixes
const updateCoupon = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  let result = await couponModel.findOneAndUpdate(id, req.body, { new: true });
  !result && next(new AppError(`Review not found you are not authorized to perform this action`, 404));

  result && res.json({ message: "success", result });
});

const deleteCoupon = factory.deleteOne(couponModel);

export { createCoupon, getAllCoupons, updateCoupon, deleteCoupon, getCoupon };
