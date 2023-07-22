import express from 'express'
import * as auth from './auth.controller.js'

const authRouter = express.Router();

authRouter.post('/signup',auth.signup)
authRouter.post('/signin',auth.signIn)


export default authRouter