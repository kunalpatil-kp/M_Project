import express from "express";
import { getRecommendations } from "../controllers/recommendedController.js";
import authMiddleware from "../middleware/auth.js";

const recommendedRouter = express.Router();

recommendedRouter.get("/", authMiddleware, getRecommendations);

export default recommendedRouter;
