import express from "express";
import * as coupon from "./coupon.controller.js";

import { uploadSingleFile } from "../../middleware/fileUpload.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";

const couponRouter = express.Router();

couponRouter
  .route("/")
  .post(
    protectedRoutes,
    allowedTo("user"),
    coupon.createCoupon
  )
  .get(coupon.getAllCoupons);

  couponRouter
  .route("/:id")
  .get(coupon.getCoupon)
  .delete(protectedRoutes, allowedTo("admin","user"), coupon.deleteCoupon)
  .put(
    protectedRoutes,
    allowedTo("user"),
    
    coupon.updateCoupon
  );

export default couponRouter;
