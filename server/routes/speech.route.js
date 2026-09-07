import express from "express";
import { getSpeechToken } from "../controllers/speechController.js";

const speechRouter = express.Router();

speechRouter.post("/speak", getSpeechToken);

export default speechRouter;