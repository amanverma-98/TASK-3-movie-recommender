import express from "express";
import userAuth from "../middlewares/useAuth.js"; 
import { userData} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/data",userAuth,userData);

export default userRouter;