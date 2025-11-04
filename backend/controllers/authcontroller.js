import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js"
import transporter from "../config/nodemailer.js";
import validator from "validator";

export const register = async (req,res) => {
    const {full_name,email,password} = req.body;
    if (!full_name||!email||!password){
        return res.json({success:false,message: "missing details"}) }
    if (!validator.isEmail(email)){
        return res.status(400).json({ success: false, message: "Please provide a valid email address." });
    }
    if (password.length < 8 || password.length >50) {
        return res.status(400).json({ success: false, message: "Password does not meet the strength requirements." });
    }
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    const complexityScore = hasUpperCase + hasLowerCase + hasNumber + hasSymbol;
    if (complexityScore < 3) {
        return res.status(400).json({ success: false, message: "Password does not meet the strength requirements." });
    }
    try{
        const ExistingUser = await userModel.findOne({email});
        if(ExistingUser){
            res.json({success:false, message:"User already exists"})
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const user = new userModel({full_name,email,password:hashedPassword});
        await user.save();
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"});

        const mailOptions = {
            from : process.env.SENDER_EMAIL,
            to : email,
            subject: "Welcome User",
            text:`Welcome to Roovie ${full_name}, your account has been created with E-Mail ID ${email}`
        }
        await transporter.sendMail(mailOptions);

        res.cookie("token",token,{
            httpOnly:true,
            secure:true,
            sameSite:none,
            maxAge:7*24*60*60*1000
        });
        

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                full_name: user.full_name,
                email: user.email,
            },
        });
    }catch(error){
        console.error("ERROR DURING REGISTRATION:", error);
        return res.json({success:false, message: error.message})
    }
}

export const login = async (req,res) => {
    const {email,password} = req.body;
    if (!email||!password){
        return res.json({success:false,message: "Both E-mail and password are required"})
    }
    try{
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success:false, message:"Invalid E-mail or Password"})
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.json({success:false,message:"Invalid E-mail or Password"})
        }
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"});
        res.cookie("token",token,{
            httpOnly:true,
            secure:true,
            sameSite:"None",
            maxAge:7*24*60*60*1000
        });
        return res.json({success:true});
    }catch(error){
        return res.json({success:false, message: error.message})
    }
}

export const logout = async (req,res) => {
    try{
        res.clearCookie("token",{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:process.env.NODE_ENV === "production"?"none": "strict",
        })
        return res.json({success:true, message:"Logged Out"});
    }
    catch(error){
        return res.json({success:false, message: error.message})
    }
}

export const verifyOTP = async (req,res) => {
    try{
        const userId = req.userId;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if(user.isVerified){
            return res.json({succes:false,message:"Account already verified"})
        }
        const email = user.email;
        const otp = String(Math.floor(100000+Math.random()*900000));
        user.verifyOTP = otp;
        user.verifyOTPExpiredAt = Date.now() + 10*60*1000;
        await user.save();
        const mailOptions = {
            from : process.env.SENDER_EMAIL,
            to : email,
            subject: "Verification OTP",
            text:`Your OTP is: ${otp}`,
            html:`<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your One-Time Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f7;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <tr><td align="center" style="padding: 40px 20px;">
                <h1 style="color: #333333; font-size: 24px; margin: 0 0 20px;">Your Verification Code</h1>
                <p style="color: #666666; font-size: 16px; line-height: 1.5; margin: 0 0 30px;">
                    Please use the following One-Time Password (OTP) to complete your action. This code is valid for 10 minutes.
                </p>
                <div style="background-color: #eef2ff; border: 2px dashed #a5b4fc; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                    <p style="color: #312e81; font-size: 36px; font-weight: bold; letter-spacing: 5px; margin: 0; text-align: center;">
                        ${otp}
                    </p>
                </div>
                <p style="color: #888888; font-size: 14px; line-height: 1.5;">
                    If you did not request this code, please ignore this email or contact support if you have any concerns.
                </p></td></tr><tr>
            <td align="center" style="padding: 20px; background-color: #f8f9fa; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                <p style="color: #999999; font-size: 12px; margin: 0;">
                    &copy; 2025 Your Company Name. All rights reserved.</p></td></tr></table></body>
                </html>`
        }
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ success: true, message: "Verification OTP has been sent to your E-mail" });
    }
    catch(error){
        return res.json({success:false, message: error.message});
    }
}

export const verifyEmail = async (req,res) => {

    const userID = req.userId;
    const {otp} = req.body;
    if(!otp){
        return res.json({success:false, message:"Missing Details"})
    }
    try{
        const user = await userModel.findById(userID);
        if(!user){
            return res.json({success:false, message:"User not found"});
        }
        if(!user.verifyOTP || user.verifyOTP !== otp){
            return res.json({success:false,message:"Invalid OTP"});
        }
        if(user.verifyOTPExpiredAt < Date.now()){
            return res.json({success:false,message:"OTP Expired"});
        }
        user.isVerified = true;
        user.verifyOTP = undefined;
        user.verifyOTPExpiredAt = undefined;
        await user.save();
        return res.json({success:true,message:"Email Verified Successfully"});
    }
    catch(error){
        return res.json({success:false, message: error.message});
    }
}

export const isAuthenticated = async (req,res) => {
    try {
        return res.json({success:true});
    } catch (error) {
        return res.json({success:false, message: error.message});
    }
}

//Reset Password
export const ResetPasswordOTP = async (req,res) => {
    const {email} = req.body;
    if(!email){
        return({success:false,message: "E-mail is required"})
    }
    try {
        const user = await userModel.findOne({email});
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const otp = String(Math.floor(100000+Math.random()*900000));
        user.resetOTP = otp;
        user.resetOTPExpiredAt = Date.now() + 10*60*1000;
        await user.save();
        const mailOptions = {
            from : process.env.SENDER_EMAIL,
            to : email,
            subject: "Password Reset OTP",
            text:`Your OTP for resetting your password is: ${otp}`
        }
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ success: true, message: "OTP has been sent to your E-mail" });

    } catch (error) {
        return res.json({success:false, message: error.message})
    }
}

export const ResetPassword = async (req,res) => {
    const {email,otp,newPassword} = req.body;
    if(!email||!newPassword||!otp){
        return res.json({success:false,message:"Missing Details"})
    }
    try {
        const user = await userModel.findOne({email});
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
         if (!user.resetOTP || user.resetOTP !== otp){
            return res.json({success:false,message:"Invalid OTP"});
        }
        if(user.resetOTPExpiredAt < Date.now()){
            return res.json({success:false,message:"OTP Expired"});
        }
        const hashedPassword = await bcrypt.hash(newPassword,10);
        user.password = hashedPassword;
        user.resetOTP = undefined;
        user.resetOTPExpiredAt = undefined;
        await user.save();
        return res.json({success:true,message:"Password Reset Successfully"});
    } catch (error) {
        return res.json({success:false, message: error.message})
    }
}