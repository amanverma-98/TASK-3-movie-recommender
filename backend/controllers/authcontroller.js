import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js"

export const register = async (req,res) => {
    const {full_name,email,password} = req.body;
    if (!full_name||!email||!password){
        return res.json({success:false,message: "missing details"}) }
    try{
        const ExistingUser = await userModel.findOne({email});
        if(ExistingUser){
            res.json({success:false, message:"User already exists"})
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const user = new userModel({full_name,email,password:hashedPassword});
        await user.save();
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"});
        res.cookie("token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:process.env.NODE_ENV === "production"?
            "none": "strict",
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
        return res.json({success:false, message: error.message})
    }
}

export const login = async (req,res) => {
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
            secure:process.env.NODE_ENV === "production",
            sameSite:process.env.NODE_ENV === "production"?
            "none": "strict",
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