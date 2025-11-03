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

userSchema.index(
    { createdAt: 1 }, 
    { 
        expireAfterSeconds: 24*60*60,
        partialFilterExpression: { isVerified: false }
    }
)

const userModel = mongoose.models.user || mongoose.model("user",userSchema);
export default userModel;