import express from "express";
import authMiddleware from "../middleware/auth.js";

import {
  createBudget,
  getBudget,
  updateBudget,
  deleteBudget,
  getBudgetAnalytics
} from "../controllers/budgetController.js";

console.log("✅ budgetRoute.js Loaded");

const budgetRouter = express.Router();

// Debug: log every request that hits the budget router
budgetRouter.use((req, res, next) => {
  console.log(`[budgetRouter] ${req.method} ${req.path}`);
  next();
});

budgetRouter.post("/create", authMiddleware, createBudget);

budgetRouter.get("/get", authMiddleware, getBudget);

budgetRouter.put("/update", authMiddleware, updateBudget);

budgetRouter.delete("/delete", authMiddleware, deleteBudget);

budgetRouter.get("/analytics", authMiddleware, getBudgetAnalytics);

export default budgetRouter;