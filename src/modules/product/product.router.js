import express from "express";
import * as product from "./product.controller.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import { imagesUpload } from "../uploads/imagesUpload.js";

const productRouter = express.Router();

let fieldsArray = [
  { name: "imgCover", maxCount: 1 },
  { name: "images", maxCount: 10 },
];

productRouter
  .route("/")
  .post(
    protectedRoutes,
    allowedTo("admin", "user"),
    imagesUpload,
    product.createProduct
  )
  .get(product.getAllProducts);

productRouter
  .route("/:id")
  .get(product.getProduct)
  .delete(protectedRoutes, allowedTo("admin"), product.deleteProduct)
  .put(protectedRoutes, allowedTo("admin", "user"), product.updateProduct);

export default productRouter;
