import mongoose from "mongoose";

/**
 * Smart Pantry Model
 *
 * Each user has ONE pantry document.
 * Items are stored as an array and merged on re-purchase.
 * Expiry is estimated from category-specific consumption days.
 */

const pantryItemSchema = new mongoose.Schema({
  foodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "food",
    required: true,
  },
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  purchaseDate: { type: Date, required: true, default: Date.now },
  estimatedDays: { type: Number, required: true }, // shelf life in days based on category
  expiryDate: { type: Date, required: true },
});

const pantrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
    },
    items: [pantryItemSchema],
  },
  { timestamps: true }
);

const pantryModel =
  mongoose.models.pantry || mongoose.model("pantry", pantrySchema);

export default pantryModel;
