import express from "express";
import * as user from "./user.controller.js";
import { protectedRoutes } from "../auth/auth.controller.js";

const userRouter = express.Router();

userRouter.route("/").post(protectedRoutes,user.createUser).get(user.getAllUsers);

userRouter
  .route("/:id")
  .get(user.getUser)
  .delete(user.deleteUser)
  .put(user.updateUser);


  userRouter.patch('/changeUserPassword/:id',user.changeUserPassword)
export default userRouter;
