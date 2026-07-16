// routes/eventRoute.js
// AI Event Ordering — production route.
// Only this file is modified. No other file is touched.

import express from "express";
import authMiddleware from "../middleware/auth.js";
import { generateEventRecommendation } from "../controllers/eventController.js";

const eventRouter = express.Router();

// POST /api/event/generate
// authMiddleware runs first → decodes JWT → injects req.body.userId
// generateEventRecommendation runs second → validates, calls service, saves to DB
eventRouter.post("/generate", authMiddleware, generateEventRecommendation);

export default eventRouter;
