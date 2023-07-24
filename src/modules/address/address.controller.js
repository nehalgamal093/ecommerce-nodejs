
import { AppError } from "../../../utils/AppError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import { userModel } from "../../../models/user.model.js";



const addAddress = catchAsyncError(async (req, res, next) => {


  let result = await userModel.findByIdAndUpdate(req.user._id, {$addToSet:{addresses:req.body}}, { new: true });
  !result && next(new AppError(`Address not found `, 404));

  result && res.json({ message: "success", result:result.addresses});
});

const removeAddress = catchAsyncError(async (req, res, next) => {
    let result = await userModel.findByIdAndUpdate(req.user._id, {$pull:{addresses:{_id:req.body.address}}}, { new: true });
    !result && next(new AppError(`Address not found `, 404));
  
    result && res.json({ message: "success", result:result.addresses});
  });

  const getAllUserAddresses = catchAsyncError(async (req, res, next) => {

  
    let result = await userModel.findOne({_id:req.user._id});
    !result && next(new AppError(`Review not found `, 404));
  
    result && res.json({ message: "success", result:result.addresses });
  });

export { addAddress,removeAddress,getAllUserAddresses};
