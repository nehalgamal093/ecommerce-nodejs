import express from "express";
import * as brand from "./brand.controller.js";
import { createBrandSchema } from "./brands.validation.js";
import {validation} from '../../middleware/validation.js'

const brandRouter = express.Router();

brandRouter.route("/").post(validation(createBrandSchema),brand.createBrand).get(brand.getAllBrands);

brandRouter
  .route("/:id")
  .get(brand.getBrand)
  .delete(brand.deleteBrand)
  .put(brand.updateBrand);

export default brandRouter;
