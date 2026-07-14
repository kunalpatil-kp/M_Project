import express from "express";
import authMiddleware from "../middleware/auth.js";

import {
  createBudget,
  getBudget,
  updateBudget,
  resetBudget,
  deleteBudget,
  getBudgetAnalytics
} from "../controllers/budgetController.js";

const budgetRouter = express.Router();

budgetRouter.post("/create", authMiddleware, createBudget);

budgetRouter.get("/get", authMiddleware, getBudget);

budgetRouter.put("/update", authMiddleware, updateBudget);

budgetRouter.post("/reset", authMiddleware, resetBudget);

budgetRouter.delete("/delete", authMiddleware, deleteBudget);

budgetRouter.get("/analytics", authMiddleware, getBudgetAnalytics);

export default budgetRouter;