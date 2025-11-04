import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./routes/authRoutes.js"
import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
const port = process.env.PORT||8000;
connectDB();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin:"https://movie-recommender-ssom.vercel.app",
    credentials:true
}));

app.get("/", (req, res) => {
    res.status(200).json({ 
        success: true, 
        message: "API is running successfully. Welcome!" 
    });
});

app.use("/api",authRouter);
app.use("/api/user",userRouter);

app.listen(port, () => console.log("server started"));
