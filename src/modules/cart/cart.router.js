import express from "express";
import * as cart from "./cart.controller.js";


import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";

const cartRouter = express.Router();

cartRouter
  .route("/")
  .post(
    protectedRoutes,
    allowedTo("user"),
    cart.addProductToCart
  )


//   cartRouter
//   .route("/:id")
//   .get(coupon.getCoupon)
//   .delete(protectedRoutes, allowedTo("admin","user"), coupon.deleteCoupon)
//   .put(
//     protectedRoutes,
//     allowedTo("user"),
    
//     coupon.updateCoupon
//   );

export default cartRouter;
