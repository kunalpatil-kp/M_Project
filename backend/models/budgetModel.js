import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
    },

    monthlyBudget: {
      type: Number,
      required: true,
      min: 100,
    },

    familySize: {
      type: Number,
      required: true,
      min: 1,
      max: 20,
    },

    currentSpent: {
      type: Number,
      default: 0,
    },

    remainingBudget: {
      type: Number,
      required: true,
    },

    budgetUsed: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const budgetModel =
  mongoose.models.budget || mongoose.model("budget", budgetSchema);

export default budgetModel;
