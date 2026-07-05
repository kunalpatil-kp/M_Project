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
        message: "Budget Planner already exists",
      });
    }

    const budget = new budgetModel({
      userId: new mongoose.Types.ObjectId(userId),
      monthlyBudget,
      familySize,
      currentSpent: 0,
      remainingBudget: monthlyBudget,
      budgetUsed: 0,
    });

    await budget.save();

    return res.json({
      success: true,
      message: "Budget Planner Created Successfully",
      data: budget,
    });
  } catch (error) {
    console.log("Budget Creation Error:", error);

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
    console.log("Get Budget Error:", error);

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

    const budget = await budgetModel.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!budget) {
      return res.json({
        success: false,
        message: "Budget Planner not found",
      });
    }

    budget.monthlyBudget = monthlyBudget;
    budget.familySize = familySize;
    budget.remainingBudget = monthlyBudget - budget.currentSpent;

    budget.budgetUsed = Number(
      ((budget.currentSpent / monthlyBudget) * 100).toFixed(2),
    );

    await budget.save();

    res.json({
      success: true,
      message: "Budget Updated Successfully",
      data: budget,
    });
  } catch (error) {
    console.log("Update Budget Error:", error);

    res.json({
      success: false,
      message: error.message || "Failed to update budget",
    });
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
    console.log("Delete Budget Error:", error);

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

    const orders = await orderModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
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

    const remaining = budget.monthlyBudget - spent;

    const budgetUsed = (spent / budget.monthlyBudget) * 100;

    let status = "Excellent";

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
    console.log("Budget Analytics Error:", error);

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
  deleteBudget,
  getBudgetAnalytics,
};
