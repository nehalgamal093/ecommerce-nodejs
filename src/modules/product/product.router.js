import express from "express";
import * as product from "./product.controller.js";
import { uploadMixOfFiles } from "../../middleware/fileUpload.js";

const productRouter = express.Router();

let fieldsArray = [{name:'imgCover',maxCount:1},{name:'images',maxCount:10}]
productRouter
  .route("/")
  .post(uploadMixOfFiles(fieldsArray,'product'),product.createProduct)
  .get(product.getAllProducts);

productRouter
  .route("/:id")
  .get(product.getProduct)
  .delete(product.deleteProduct)
  .put(product.updateProduct);

export default productRouter;
