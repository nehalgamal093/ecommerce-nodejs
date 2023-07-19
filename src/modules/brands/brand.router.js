import express from "express";
import * as brand from "./brand.controller.js";


const brandRouter = express.Router();

brandRouter.route("/").post(brand.createBrand).get(brand.getAllBrands);

brandRouter
  .route("/:id")
  .get(brand.getBrand)
  .delete(brand.deleteBrand)
  .put(brand.updateBrand);

export default brandRouter;
