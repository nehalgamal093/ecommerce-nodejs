import express from "express";
import * as auth from "./auth.controller.js";
import {
  loginValidation,
  signupValidation,
} from "../../middleware/validate.js";

const authRouter = express.Router();

authRouter.post("/signup", signupValidation, auth.signup);
authRouter.post("/signin", loginValidation, auth.signIn);

export default authRouter;
