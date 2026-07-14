import budgetModel from "../models/budgetModel.js";
import orderModel from "../models/ordermodel.js";
import mongoose from "mongoose";

const createBudget = async (req, res) => {
  try {
    const { monthlyBudget, familySize, userId } = req.body;

    // Validation
    if (!monthlyBudget || !familySize) {
      return res.json({
        success: false,
        message: "Monthly Budget and Family Size are required",
      });
    }

    if (!userId) {
      return res.json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Check if user already has a planner
    const existingBudget = await budgetModel.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (existingBudget) {
      return res.json({
        success: false,
        message: "Budget Planner already exists. Use the update option to modify it.",
      });
    }

    const budget = new budgetModel({
      userId: new mongoose.Types.ObjectId(userId),
      monthlyBudget: Number(monthlyBudget),
      familySize: Number(familySize),
      currentSpent: 0,
      remainingBudget: Number(monthlyBudget),
      budgetUsed: 0,
    });

    await budget.save();

    return res.json({
      success: true,
      message: "Budget Planner Created Successfully",
      data: budget,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message || "Failed to create budget",
    });
  }
};

const getBudget = async (req, res) => {
  try {
    const userId = req.body.userId;

    if (!userId) {
      return res.json({
        success: false,
        message: "User not authenticated",
      });
    }

    const budget = await budgetModel.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!budget) {
      return res.json({
        success: false,
        message: "Budget Planner not found",
      });
    }

    res.json({
      success: true,
      data: budget,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message || "Failed to get budget",
    });
  }
};

const updateBudget = async (req, res) => {
  try {
    const { userId, monthlyBudget, familySize } = req.body;

    if (!userId) {
      return res.json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (!monthlyBudget || !familySize || monthlyBudget < 100) {
      return res.json({
        success: false,
        message: "Monthly Budget must be at least ₹100 and Family Size is required",
      });
    }

    const budget = await budgetModel.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!budget) {
      return res.json({
        success: false,
        message: "Budget Planner not found",
      });
    }

    budget.monthlyBudget = Number(monthlyBudget);
    budget.familySize = Number(familySize);
    // Clamp so stored values never go negative or exceed 100% when overspent
    budget.remainingBudget = Math.max(budget.monthlyBudget - budget.currentSpent, 0);
    budget.budgetUsed = Number(
      Math.min((budget.currentSpent / budget.monthlyBudget) * 100, 100).toFixed(2),
    );

    await budget.save();

    res.json({
      success: true,
      message: "Budget Updated Successfully",
      data: budget,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message || "Failed to update budget",
    });
  }
};

const resetBudget = async (req, res) => {
  try {
    const userId = req.body.userId;

    if (!userId) {
      return res.json({ success: false, message: "User not authenticated" });
    }

    const budget = await budgetModel.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!budget) {
      return res.json({ success: false, message: "Budget Planner not found" });
    }

    // Re-aggregate this month's paid orders to compute the accurate reset baseline.
    // This handles the edge case where verifyOrder incremented currentSpent across
    // a month boundary — we always reset to what was actually spent this month.
    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setMonth(end.getMonth() + 1);
    end.setDate(0);
    end.setHours(23, 59, 59, 999);

    const orders = await orderModel.aggregate([
      {
        $match: {
          userId: userId,   // orderModel.userId is type:String
          payment: true,
          date: { $gte: start, $lte: end },
        },
      },
      { $group: { _id: null, totalSpent: { $sum: "$amount" } } },
    ]);

    const currentMonthSpent = orders.length > 0 ? orders[0].totalSpent : 0;

    budget.currentSpent   = currentMonthSpent;
    budget.remainingBudget = Math.max(budget.monthlyBudget - currentMonthSpent, 0);
    budget.budgetUsed     = Number(
      Math.min((currentMonthSpent / budget.monthlyBudget) * 100, 100).toFixed(2)
    );

    await budget.save();

    res.json({
      success: true,
      message: "Budget reset to current month",
      data: budget,
    });
  } catch (error) {
    res.json({ success: false, message: error.message || "Failed to reset budget" });
  }
};

const deleteBudget = async (req, res) => {
  try {
    const userId = req.body.userId;

    if (!userId) {
      return res.json({
        success: false,
        message: "User not authenticated",
      });
    }

    await budgetModel.findOneAndDelete({
      userId: new mongoose.Types.ObjectId(userId),
    });

    res.json({
      success: true,
      message: "Budget Planner Deleted Successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message || "Failed to delete budget",
    });
  }
};

const getBudgetAnalytics = async (req, res) => {
  try {
    const userId = req.body.userId;

    if (!userId) {
      return res.json({
        success: false,
        message: "User not authenticated",
      });
    }

    const budget = await budgetModel.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!budget) {
      return res.json({
        success: false,
        message: "Budget not found",
      });
    }

    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setMonth(end.getMonth() + 1);
    end.setDate(0);
    end.setHours(23, 59, 59, 999);

    // IMPORTANT: orderModel stores userId as a plain String (not ObjectId)
    // Matching as ObjectId would return 0 results. Match as String instead.
    const orders = await orderModel.aggregate([
      {
        $match: {
          userId: userId,        // ← String match (orderModel.userId is type:String)
          payment: true,
          date: {
            $gte: start,
            $lte: end,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalSpent: {
            $sum: "$amount",
          },
          totalOrders: {
            $sum: 1,
          },
        },
      },
    ]);

    let spent = 0;
    let totalOrders = 0;

    if (orders.length > 0) {
      spent = orders[0].totalSpent;
      totalOrders = orders[0].totalOrders;
    }

    const remaining = Math.max(budget.monthlyBudget - spent, 0);

    // Cap at 100 so ProgressBar label and width are always consistent
    const budgetUsed = Math.min((spent / budget.monthlyBudget) * 100, 100);

    let status;

    if (budgetUsed > 90) status = "Budget Almost Finished";
    else if (budgetUsed > 70) status = "Be Careful";
    else if (budgetUsed > 50) status = "Good";
    else status = "Excellent";

    res.json({
      success: true,
      analytics: {
        monthlyBudget: budget.monthlyBudget,
        familySize: budget.familySize,
        spent,
        remaining,
        totalOrders,
        budgetUsed: Number(budgetUsed.toFixed(2)),
        status,
      },
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message || "Failed to get analytics",
    });
  }
};

export {
  createBudget,
  getBudget,
  updateBudget,
  resetBudget,
  deleteBudget,
  getBudgetAnalytics,
};
