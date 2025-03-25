import { AppError } from "../../../utils/AppError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import { cartModel } from "../../../models/cart.model.js";
import { productModel } from "../../../models/product.model.js";
import { couponModel } from "../../../models/coupon.model.js";
function calTotalPrice(cart) {
  let totalPrice = 0;
  cart.cartItems.forEach((elm) => {
    totalPrice += elm.quantity * elm.price;
  });
  cart.totalPrice = totalPrice;
}
const addProductToCart = catchAsyncError(async (req, res, next) => {
  let product = await productModel.findById(req.body.product);
  if (!product) return next(new AppError("product not fount", 401));
  req.body.price = product.price;
  let isCartExist = await cartModel.findOne({ user: req.user._id });
  if (!isCartExist) {
    let cart = new cartModel({
      user: req.user._id,
      cartItems: [req.body],
    });
    calTotalPrice(cart);
    await cart.save();
    return res.json({ message: "success", cart });
  }
  let item = isCartExist.cartItems.find(
    (elm) => elm.product == req.body.product
  );
  if (item) {
    item.quantity += 1;
  } else {
    isCartExist.cartItems.push(req.body);
  }
  calTotalPrice(isCartExist);
  if (isCartExist.discount) {
    isCartExist.totalPriceAfterDiscount =
      isCartExist.totalPrice -
      (isCartExist.totalPrice * isCartExist.discount) / 100;
  }
  await isCartExist.save();
  return res.json({ message: "success", cart: isCartExist });
});

const removeProductFromCart = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  const cart = await cartModel.findOne({ user: userId });
  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }

  const result = await cartModel.findOneAndUpdate(
    { user: userId },
    { $pull: { cartItems: { product: id } } },
    { new: true }
  );

  if (!result) {
    return next(new AppError("Failed to update cart", 400));
  }

  console.log("Cart items after:", result.cartItems);

  calTotalPrice(result);

  if (result.discount) {
    result.totalPriceAfterDiscount =
      result.totalPrice - (result.totalPrice * result.discount) / 100;
  }

  await result.save();

  res.status(200).json({
    status: "success",
    data: {
      cart: result,
    },
  });
});

const updateQuantity = catchAsyncError(async (req, res, next) => {
  let product = await productModel.findById(req.params.id).select("price");
  if (!product) return next(new AppError("product not fount", 404));

  let isCartExist = await cartModel.findOne({ user: req.user._id });

  let item = isCartExist.cartItems.find((elm) => elm.product == req.params.id);
  if (item) {
    item.quantity = req.body.quantity;
  }
  calTotalPrice(isCartExist);
  if (isCartExist.discount) {
    isCartExist.totalPriceAfterDiscount =
      isCartExist.totalPrice -
      (isCartExist.totalPrice * isCartExist.discount) / 100;
  }
  await isCartExist.save();
  return res.json({ message: "success", cart: isCartExist });
});

const applyCoupon = catchAsyncError(async (req, res, next) => {
  let coupon = await couponModel.findOne({
    code: req.body.code,
    expires: { $gt: Date.now() },
  });
  let cart = await cartModel.findOne({ user: req.user._id });
  cart.totalPriceAfterDiscount =
    cart.totalPrice - (cart.totalPrice * coupon.discount) / 100;
  cart.discount = coupon.discount;
  await cart.save();
  res.status(201).json({ message: "success", cart });
});
const getLoggedUserCart = catchAsyncError(async (req, res, next) => {
  let cartItems = await cartModel
    .findOne({ user: req.user._id })
    .populate("cartItems.product");
  if (!cartItems) {
    res.status(201).json({ message: "success", cart: {} });
  }
  res.status(201).json({ message: "success", cart: cartItems });
});
export {
  addProductToCart,
  removeProductFromCart,
  updateQuantity,
  applyCoupon,
  getLoggedUserCart,
};
