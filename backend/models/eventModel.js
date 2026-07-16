import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },

  eventType: {
    type: String,
    required: true,
    enum: [
      "Birthday",
      "Office Party",
      "Wedding",
      "College Event",
      "Friends Party",
      "Family Function",
    ],
  },

  guestCount: {
    type: Number,
    required: true,
    min: 1,
  },

  budget: {
    type: Number,
    required: true,
    min: 100,
  },

  foodPreference: {
    type: String,
    enum: ["Veg", "Non Veg", "Mixed"],
  },

  mealType: {
    type: String,
    enum: ["Breakfast", "Lunch", "Dinner", "Snacks"],
  },

  spiceLevel: {
    type: String,
    enum: ["Low", "Medium", "High"],
  },

  specialRequirement: {
    type: String,
    default: "",
  },

  generatedMenu: {
    type: Array,
    default: [],
  },

  totalCost: {
    type: Number,
    default: 0,
  },

  remainingBudget: {
    type: Number,
    default: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const eventModel =
  mongoose.models.event || mongoose.model("event", eventSchema, "events");

export default eventModel;
