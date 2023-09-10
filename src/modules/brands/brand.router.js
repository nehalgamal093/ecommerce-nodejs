import express from "express";
import * as brand from "./brand.controller.js";
import { createBrandSchema } from "./brands.validation.js";
import {validation} from '../../middleware/validation.js'
// import { uploadSingleFile } from "../../middleware/fileUpload.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";

const brandRouter = express.Router();

// brandRouter.route("/").post(protectedRoutes,allowedTo('admin'),uploadSingleFile('logo','brand'),validation(createBrandSchema),brand.createBrand).get(brand.getAllBrands);
brandRouter.route("/").post(protectedRoutes,allowedTo('admin'),validation(createBrandSchema),brand.createBrand).get(brand.getAllBrands);

// brandRouter
//   .route("/:id")
//   .get(brand.getBrand)
//   .delete(protectedRoutes,allowedTo('admin'),brand.deleteBrand)
//   .put(protectedRoutes,allowedTo('admin'),uploadSingleFile('logo','brand'),brand.updateBrand);

brandRouter
   .route("/:id")
   .get(brand.getBrand)
   .delete(protectedRoutes,allowedTo('admin'),brand.deleteBrand)
   .put(protectedRoutes,allowedTo('admin'),brand.updateBrand);
export default brandRouter;
