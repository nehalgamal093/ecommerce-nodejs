import express from "express";
import * as addresses from "./address.controller.js";

import { uploadSingleFile } from "../../middleware/fileUpload.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";

const addresstRouter = express.Router();

addresstRouter
  .route("/")
  .patch(
    protectedRoutes,
    allowedTo("user"),
    addresses.addAddress
  ).delete(
    protectedRoutes,
    allowedTo("user"),
    addresses.removeAddress
  ).get(
    protectedRoutes,
    allowedTo("user"),
    addresses.getAllUserAddresses
  )




export default addresstRouter;
