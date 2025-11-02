import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    const {token} = req.cookies;
    if(!token){
        return res.json({success:false, message:"Not Authorized. Please Login Again"});
    }
    try{
        const TokenDecode = jwt.verify(token,process.env.JWT_SECRET);
        req.userId = TokenDecode.id;
        next();
    }
    catch(error){
        return res.json({success:false, message: error.message});
    }
}

export default userAuth;