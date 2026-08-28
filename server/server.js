import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import { isAuth } from "./middlewares/auth.middleware.js";
import userRouter from "./routes/user.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.json());
app.use(cookieParser());


app.use("/api/user", userRouter);
app.use("/api/user",userRouter);

const PORT = process.env.PORT || 6000;
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();

})
