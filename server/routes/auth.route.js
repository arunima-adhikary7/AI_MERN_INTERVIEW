
import express from "express";

import {
  signup,
  login,
  googleAuth,
  logout,
} from "../controllers/auth.controller.js";

const authRouter = express.Router();

// ================= AUTH ROUTES =================

// Normal signup
authRouter.post("/signup", signup);

// Normal login
authRouter.post("/login", login);

// Google login/signup
authRouter.post("/google", googleAuth);

// Logout
authRouter.get("/logout", logout);

export default authRouter;

