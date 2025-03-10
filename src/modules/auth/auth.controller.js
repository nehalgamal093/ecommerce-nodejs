import { userModel } from "../../../models/user.model.js";
import { AppError } from "../../../utils/AppError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const signup = catchAsyncError(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  let isFound = await userModel.findOne({ email: req.body.email });

  if (isFound) return next(new AppError("Email already exists", 409));

  let user = new userModel(req.body);

  await user.save();
  res.json({ message: "success", user });
});

export const signIn = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  let isFound = await userModel.findOne({ email });
  const match = await bcrypt.compare(password, isFound.password);
  let user = new userModel(req.body);
  if (isFound && match) {
    let token = jwt.sign(
      { name: isFound.name, userId: isFound._id, role: isFound.role },
      process.env.KEY
    );
    return res.json({ message: "success", token, user, _id: isFound._id });
  }
  next(new AppError("Incorrect email or password", 401));
});

export const protectedRoutes = catchAsyncError(async (req, res, next) => {
  let { token } = req.headers;
  if (!token) return next(new AppError("Token not provided", 401));

  let decoded = jwt.verify(token, process.env.KEY);

  let user = await userModel.findById(decoded.userId);
  if (!user) return next(new AppError("invalid token2", 401));
  if (user.passwordChangedAt) {
    let changePasswordDate = parseInt(user.passwordChangedAt.getTime() / 1000);
    if (changePasswordDate > decoded.iat)
      return next(new AppError("invalid token", 401));
  }
  req.user = user;
  next();
});

export const allowedTo = (...roles) => {
  return catchAsyncError(async (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError(
          "You are not authorized to access this route. you are " +
            req.user.role,
          404
        )
      );
    next();
  });
};
