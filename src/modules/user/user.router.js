import express from "express";
import * as user from "./user.controller.js";
import { protectedRoutes } from "../auth/auth.controller.js";
import { imageCoverUpload } from "../uploads/imageUpload.js";
const userRouter = express.Router();

userRouter
  .route("/")
  .post(imageCoverUpload, protectedRoutes, user.createUser)
  .get(user.getAllUsers);

userRouter
  .route("/:id")
  .get(user.getUser)
  .delete(user.deleteUser)
  .put(user.updateUser);

userRouter.patch("/changeUserPassword/:id", user.changeUserPassword);
export default userRouter;
