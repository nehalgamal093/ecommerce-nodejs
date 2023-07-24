import { AppError } from "../../../utils/AppError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import { cartModel } from "../../../models/cart.model.js";
import { productModel } from "../../../models/product.model.js";
import { orderModel } from "../../../models/order.model.js";
import Stripe from "stripe";

const stripe = new Stripe("secretkey");

const createCashOrder = catchAsyncError(async (req, res, next) => {
  const cart = await cartModel.findById(req.params.id);
  const totalOrderPrice = cart.totalOrderPrice
    ? cart.totalPriceAfterDiscount
    : cart.totalPrice;
  const order = new orderModel({
    user: req.user._id,
    cartItems: cart.cartItems,
    totalOrderPrice,
    shippingAddress: req.body.shippingAddress,
  });

  await order.save();

  if (order) {
    let options = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: item.quantity } },
      },
    }));
    await productModel.bulkWrite(options);
    await cartModel.findByIdAndDelete(req.params.id);
    return res.status(201).json({ message: "success", order });
  } else {
    return next(new AppError("error in cart occured"), 404);
  }
});

const getSpecificOrder = catchAsyncError(async (req, res, next) => {
  let order = await orderModel
    .findOne({ user: req.user._id })
    .populate("cartItems.product");
  res.status(200).json({ message: "success", order });
});

const getAllOrders = catchAsyncError(async (req, res, next) => {
  let orders = await orderModel.find().populate("cartItems.product");
  res.status(200).json({ message: "success", orders });
});

const createCheckOutSession = catchAsyncError(async (req, res, next) => {
  const cart = await cartModel.findById(req.params.id);
  const totalOrderPrice = cart.totalOrderPrice
    ? cart.totalPriceAfterDiscount
    : cart.totalPrice;
  let session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          unit_amount: totalOrderPrice * 100,
          product_data: {
            name: req.user.name,
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",

    //if success send front end link
    success_url: "",
    //if cancelledsend him to cart for example
    cancel_url: "",
    customer_email: "",
    client_reference_id: req.params.id,
    //meta data for additional information
    metadata: req.body.shippingAddress,
  });
  res.json({ message: "success", session });
});

export {
  createCashOrder,
  getSpecificOrder,
  getAllOrders,
  createCheckOutSession,
};
