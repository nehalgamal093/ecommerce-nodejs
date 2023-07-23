import { reviewModel } from "../../../models/review.model.js";
import { AppError } from "../../../utils/AppError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import * as factory from "../handlers/factor.handler.js";
import { ApiFeatures } from "../../../utils/ApiFeatures.js";

const createReview = catchAsyncError(async (req, res, next) => {
  req.body.user = req.user._id;
  let isReview = await reviewModel.findOne({
    user: req.user._id,
    product: req.body.product,
  });
  if (isReview) return next(new AppError("you created a review before", 409));
  let result = new reviewModel(req.body);
  await result.save();
  res.json({ message: "success", result, result });
});

const getAllReviews = catchAsyncError(async (req, res) => {
  let apiFeatures = new ApiFeatures(reviewModel.find(), req.query)
    .paginate()
    .fields()
    .filter()
    .sort()
    .search();

  //execute query
  let result = await apiFeatures.mongooseQuery;
  res.json({ message: "success", page: apiFeatures.page, result });
});

const getReview = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let result = await reviewModel.findById(id);
  !result && next(new AppError(`Reviewnot found ${req.originalUrl}`, 404));

  result && res.json({ message: "success", result });
});
//need fixes
const updateReview = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  let result = await reviewModel.findOneAndUpdate({_id:id,user:req.user._id}, req.body, { new: true });
  !result && next(new AppError(`Review not found you are not authorized to perform this action`, 404));

  result && res.json({ message: "success", result });
});

const deleteReview = factory.deleteOne(reviewModel);

export { createReview, getAllReviews, updateReview, deleteReview, getReview };
