import express from 'express';
import { getCurrentUser } from '../controllers/auth.controller';


const  userRouter = express.Router();

userRouter.get("/current-user",isAuth,getCurrentUser);


export default userRouter;
