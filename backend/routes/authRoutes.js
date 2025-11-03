import express from "express"
import {register,login,logout, verifyEmail,verifyOTP,isAuthenticated, ResetPasswordOTP, ResetPassword} from "../controllers/authcontroller.js";
import userAuth from "../middlewares/useAuth.js"

const authRouter = express.Router();

authRouter.post("/register",register);
authRouter.post("/register/Verify-OTP",userAuth,verifyOTP);
authRouter.post("/register/Verify-account",userAuth,verifyEmail);
authRouter.post("/login",login);
authRouter.post("/logout",logout); 
authRouter.post("/is-auth",userAuth,isAuthenticated);
authRouter.post("/send-reset-otp",ResetPasswordOTP);
authRouter.post("/reset-password",ResetPassword);

export default authRouter;