import { userModel } from "../../../models/user.model.js";
import { AppError } from "../../../utils/AppError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import * as factory from "../handlers/factor.handler.js";
import { ApiFeatures } from "../../../utils/ApiFeatures.js";
import cloudinary from "../../../config/cloudinary.js";
const createUser = catchAsyncError(async (req, res, next) => {
  let user = await userModel.findOne({ email: req.body.email });
  if (user) return next(new AppError("Account already exist", 409));
  let result;
  try {
    if (req.files && req.files.length > 0) {
      result = new userModel({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        image: (await cloudinary.uploader.upload(req.files[0].path)).secure_url,
        cloudinary_id: (await cloudinary.uploader.upload(req.files[0].path))
          .public_id,
      });
    } else {
      result = new userModel({
        ...req.body,
      });
    }
    await result.save();
    res.status(200).json({ sucess: "success", result });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
  // let result = new userModel(req.body);
  // await result.save();
  // res.json({ message: "success", result });
});

const getAllUsers = catchAsyncError(async (req, res) => {
  let apiFeatures = new ApiFeatures(userModel.find(), req.query)
    .paginate()
    .fields()
    .filter()
    .sort()
    .search();

  //execute query
  let result = await apiFeatures.mongooseQuery;
  res.json({ message: "success", page: apiFeatures.page, result });
});

const getUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let result = await userModel.findById(id);
  !result && next(new AppError(`User not found ${req.originalUrl}`, 404));

  result && res.json({ message: "success", result });
});

const updateUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  let result = await userModel.findByIdAndUpdate(id, req.body, { new: true });
  !result && next(new AppError(`User not found ${req.originalUrl}`, 404));

  result && res.json({ message: "success", result });
});

const deleteUser = factory.deleteOne(userModel);
const changeUserPassword = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  req.body.passwordChangedAt = Date.now();

  let result = await userModel.findByIdAndUpdate(id, req.body, { new: true });
  !result && next(new AppError(`User not found ${req.originalUrl}`, 404));

  result && res.json({ message: "success", result });
});
export {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getUser,
  changeUserPassword,
};
