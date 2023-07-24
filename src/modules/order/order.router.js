import express from "express";
import * as order from "./order.controller.js";


import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";

const orderRouter = express.Router();

orderRouter
  .route("/")
  .get(
    protectedRoutes,
    allowedTo("user"),
    order.getSpecificOrder
  )

  orderRouter
  .route("/allorders")
  .get(
    protectedRoutes,
    allowedTo("user"),
    order.getAllOrders
  )


  orderRouter
  .route("/:id")
  .post(protectedRoutes, allowedTo("admin","user"),order.createCashOrder)
  
  orderRouter.post('/checkout/:id',protectedRoutes,allowedTo('user'),order.createCheckOutSession)
  
  

export default orderRouter;
