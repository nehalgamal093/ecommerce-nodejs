import { userModel } from "../../../models/user.model.js";
import { AppError } from "../../../utils/AppError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
export const signup = catchAsyncError(async(req,res,next)=>{
    let isFound = await userModel.findOne({email:req.body.email})

    if(isFound) return next(new AppError('email already exists',409))
    let user = new userModel(req.body)
    await user.save();
    res.json({message:'success',user})
})

export const signIn = catchAsyncError(async(req,res,next)=>{
    const {email,password} = req.body;
    let isFound = await userModel.findOne({email})
    const match = await bcrypt.compare(password,isFound.password)
    if(isFound &&  match) {
        let token = jwt.sign({name:isFound.name,userID:isFound._id,role:isFound.role},process.env.KEY)
        return res.json({message:'success',token})
    }
    next(new AppError('incorrect email or password',401))
})