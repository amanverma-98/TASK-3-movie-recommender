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

const whitelist = [
    'http://localhost:8000', 
    'https://movie-recommender-ssom-4j0019viy-akshats-projects-18d1f938.vercel.app/' 
];
const corsOptions = {
    
    origin: function (origin, callback) {
        
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true); // Allow the request
        } else {
            callback(new Error('This origin is not allowed by CORS')); // Block the request
        }
    },
    credentials: true 
};
app.use(cors(corsOptions));

app.get("/", (req, res) => {
    res.status(200).json({ 
        success: true, 
        message: "API is running successfully. Welcome!" 
    });
});

app.use("/api",authRouter);
app.use("/api/user",userRouter);

app.listen(port, () => console.log("server started"));
