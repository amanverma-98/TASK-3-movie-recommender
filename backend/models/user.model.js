import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    full_name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
    },
    verifyOTP:{
        type:String,
        default:" "
    },
    verifyOTPExpiredAt:{
        type:Number,
        default:0
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    resetOTP:{
        type:String,
        default:" "
    },
    resetOTPExpiredAt:{
        type:Number,
        default:0
    }
},{timestamps:true})

const userModel = mongoose.models.user || mongoose.model("user",userSchema);
export default userModel;