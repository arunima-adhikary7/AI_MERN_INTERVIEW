import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/connectionDb.js";
// import { isAuth } from "./middlewares/isAuth.js";
 import userRouter from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import interviewRouter from "./routes/interview.route.js";
import paymentRouter from "./routes/payment.route.js";

dotenv.config();
const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authRouter);
app.use("/api/user",userRouter);
app.use("/api/interview", interviewRouter);
app.use("/api/payment", paymentRouter);

const PORT = process.env.PORT || 6000;
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();

})
