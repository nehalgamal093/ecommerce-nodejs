import { AppError } from "../../utils/AppError.js";
import { globalErrorMiddleware } from "../middleware/globalErrorAsyncError.js";
import authRouter from "./auth/auth.router.js";
import brandRouter from "./brands/brand.router.js";
import categoryRouter from "./category/category.router.js";
import productRouter from "./product/product.router.js";
import reviewRouter from "./review/review.router.js";
import subCategoryRouter from "./subcategory/subcategory.router.js";
import userRouter from "./user/user.router.js";
import express from 'express'
import wishlistRouter from "./wishlist/wishlist.router.js";
import addresstRouter from "./address/address.router.js";
import couponRouter from "./coupon/coupon.router.js";
import cartRouter from "./cart/cart.router.js";
import orderRouter from "./order/order.router.js";


export function init(app){
    // app.use(express.static("uploads"));
    app.use("/api/v1/categories", categoryRouter);
    app.use("/api/v1/subcategories", subCategoryRouter);
    app.use("/api/v1/brands", brandRouter);
    app.use("/api/v1/products", productRouter);
    app.use("/api/v1/users", userRouter);
    app.use('/api/v1/auth',authRouter)
    app.use("/api/v1/reviews", reviewRouter);
    app.use("/api/v1/wishlist", wishlistRouter);
    app.use("/api/v1/addresses", addresstRouter);
    app.use("/api/v1/coupons", couponRouter);
    app.use("/api/v1/cart", cartRouter);
    app.use("/api/v1/order", orderRouter);
    app.all("*", (req, res, next) => {
      next(new AppError(`can't find this route: ${req.originalUrl}`, 404));
    });
    app.use(globalErrorMiddleware);
}