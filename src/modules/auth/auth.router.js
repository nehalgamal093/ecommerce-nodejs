import express from "express";
import * as auth from "./auth.controller.js";
import { signupValidation } from "../../middleware/validate.js";

const authRouter = express.Router();

authRouter.post("/signup", signupValidation, auth.signup);
authRouter.post("/signin", auth.signIn);

export default authRouter;
