import express from "express";
import authMiddleware from "../middleware/auth.js";
import { getPantry, removeFromPantry } from "../controllers/pantryController.js";

const pantryRouter = express.Router();

// GET /api/pantry  → returns enriched pantry items + AI notifications
pantryRouter.get("/", authMiddleware, getPantry);

// POST /api/pantry/remove → remove a single pantry item
pantryRouter.post("/remove", authMiddleware, removeFromPantry);

export default pantryRouter;
