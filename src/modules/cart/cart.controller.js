
import { AppError } from "../../../utils/AppError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import { cartModel } from "../../../models/cart.model.js";


const addProductToCart = catchAsyncError(async (req, res, next) => {
let isCartExist = await cartModel.findOne({user:req.user._id})
if(!isCartExist){
    let result = new cartModel({
        user:req.user._id,
        cartItems:[req.body]
    });
    await result.save();
   return res.json({ message: "success", result, result });
}
return res.json({ message: "success" }); 
});


export { addProductToCart};
