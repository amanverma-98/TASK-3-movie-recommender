import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./routes/authRoutes.js"
import connectDB from "./config/mongodb.js";

const app = express();
const port = process.env.PORT||8000;
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials:true}))

app.use("/api",authRouter)

app.listen(port, () => console.log("server started"))
