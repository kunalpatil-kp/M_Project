import budgetModel from "../models/budgetModel.js";
import orderModel from "../models/ordermodel.js";
import mongoose from "mongoose";

const createBudget = async (req, res) => {
  try {
    console.log("[createBudget] req.body:", req.body);

    const { monthlyBudget, familySize, userId } = req.body;

    console.log("[createBudget] userId from auth middleware:", userId);
    console.log("[createBudget] monthlyBudget:", monthlyBudget, "familySize:", familySize);

    // Validation
    if (!monthlyBudget || !familySize) {
      console.log("[createBudget] Validation failed: missing monthlyBudget or familySize");
      return res.json({
        success: false,
        message: "Monthly Budget and Family Size are required",
      });
    }

    if (!userId) {
      console.log("[createBudget] Validation failed: userId missing");
      return res.json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Check if user already has a planner
    console.log("[createBudget] Checking for existing budget for userId:", userId);
    const existingBudget = await budgetModel.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (existingBudget) {
      console.log("[createBudget] Budget already exists:", existingBudget._id);
      return res.json({
        success: false,
        message: "Budget Planner already exists. Use the update option to modify it.",
      });
    }

    console.log("[createBudget] Creating new budget document...");
    const budget = new budgetModel({
      userId: new mongoose.Types.ObjectId(userId),
      monthlyBudget: Number(monthlyBudget),
      familySize: Number(familySize),
      currentSpent: 0,
      remainingBudget: Number(monthlyBudget),
      budgetUsed: 0,
    });

    await budget.save();
    console.log("[createBudget] Budget saved successfully. _id:", budget._id);

    return res.json({
      success: true,
      message: "Budget Planner Created Successfully",
      data: budget,
    });
  } catch (error) {
    console.log("[createBudget] ERROR:", error.name, error.message);
    if (error.errors) {
      console.log("[createBudget] Mongoose Validation Errors:", JSON.stringify(error.errors, null, 2));
    }

    return res.json({
      success: false,
      message: error.message || "Failed to create budget",
    });
  }
};

const getBudget = async (req, res) => {
  try {
    const userId = req.body.userId;
    console.log("[getBudget] userId:", userId);

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
      console.log("[getBudget] No budget found for userId:", userId);
      return res.json({
        success: false,
        message: "Budget Planner not found",
      });
    }

    console.log("[getBudget] Budget found:", budget._id);
    res.json({
      success: true,
      data: budget,
    });
  } catch (error) {
    console.log("[getBudget] ERROR:", error.message);

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
    budget.remainingBudget = budget.monthlyBudget - budget.currentSpent;

    budget.budgetUsed = Number(
      ((budget.currentSpent / budget.monthlyBudget) * 100).toFixed(2),
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

    // IMPORTANT: orderModel stores userId as a plain String (not ObjectId)
    // Matching as ObjectId would return 0 results. Match as String instead.
    console.log("[getBudgetAnalytics] Querying orders for userId (String):", userId);
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
    console.log("[getBudgetAnalytics] Aggregation result:", orders);

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
