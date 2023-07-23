import express from "express";
import * as review from "./review.controller.js";

import { uploadSingleFile } from "../../middleware/fileUpload.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";

const reviewRouter = express.Router();

reviewRouter
  .route("/")
  .post(
    protectedRoutes,
    allowedTo("user"),
    review.createReview
  )
  .get(review.getAllReviews);

  reviewRouter
  .route("/:id")
  .get(review.getReview)
  .delete(protectedRoutes, allowedTo("admin","user"), review.deleteReview)
  .put(
    protectedRoutes,
    allowedTo("user"),
    uploadSingleFile("logo", "review"),
    review.updateReview
  );

export default reviewRouter;
