import userModel from "../models/user.model.js";

export const userData = async (req,res) => {
    try {
        const userId = req.userId;
        const user = await userModel.findById(userId);
        if (!user){
            return res.json({success:false,message:"User not Found"});
        }
        return res.json({
            success:true,
            user:{
                full_name:user.full_name,
                email: user.email,
                isVerified:user.isVerified,
                createdAt: user.createdAt
            }
        })
    } catch (error) {
        return res.json({success:false, message: error.message});
    }
}

