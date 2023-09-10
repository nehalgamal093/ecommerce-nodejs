import express from "express";
import * as product from "./product.controller.js";
// import { uploadMixOfFiles } from "../../middleware/fileUpload.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";


const productRouter = express.Router();

let fieldsArray = [{name:'imgCover',maxCount:1},{name:'images',maxCount:10}]
// productRouter
//   .route("/")
//   .post(protectedRoutes,allowedTo('admin','user'),uploadMixOfFiles(fieldsArray,'product'),product.createProduct)
//   .get(product.getAllProducts);
  productRouter
  .route("/")
  .post(protectedRoutes,allowedTo('admin','user'),product.createProduct)
  .get(product.getAllProducts);

productRouter
  .route("/:id")
  .get(product.getProduct)
  .delete(protectedRoutes,allowedTo('admin'),product.deleteProduct)
  .put(protectedRoutes,allowedTo('admin','user'),product.updateProduct);

export default productRouter;
