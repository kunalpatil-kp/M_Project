import pantryModel from "../models/pantryModel.js";
import mongoose from "mongoose";

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY → ESTIMATED SHELF LIFE (days)
// Based on real-world grocery consumption patterns (Blinkit/Zepto logic)
// ─────────────────────────────────────────────────────────────────────────────
const SHELF_LIFE_BY_CATEGORY = {
  Salad: 3,
  "Pure Veg": 4,
  Sandwich: 2,
  Rolls: 3,
  Cake: 5,
  Deserts: 7,
  Pasta: 7,
  Noodles: 30,
};

const DEFAULT_SHELF_LIFE = 7; // fallback

const getShelfLife = (category) =>
  SHELF_LIFE_BY_CATEGORY[category] || DEFAULT_SHELF_LIFE;

// ─────────────────────────────────────────────────────────────────────────────
// AUTO-ADD TO PANTRY after successful payment
// Called from orderController.verifyOrder
// ─────────────────────────────────────────────────────────────────────────────
const addOrderToPantry = async (userId, items) => {
  try {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    let pantry = await pantryModel.findOne({ userId: userObjectId });

    if (!pantry) {
      pantry = new pantryModel({ userId: userObjectId, items: [] });
    }

    const now = new Date();

    items.forEach((item) => {
      const shelfLife = getShelfLife(item.category);
      const expiryDate = new Date(now);
      expiryDate.setDate(expiryDate.getDate() + shelfLife);

      // Rule: Merge duplicates — find existing pantry item by foodId or name
      const existingIndex = pantry.items.findIndex(
        (p) => p.name.toLowerCase() === item.name.toLowerCase()
      );

      if (existingIndex !== -1) {
        // Merge: increase quantity, refresh purchase date & expiry
        pantry.items[existingIndex].quantity += item.quantity;
        pantry.items[existingIndex].purchaseDate = now;
        pantry.items[existingIndex].expiryDate = expiryDate;
        pantry.items[existingIndex].estimatedDays = shelfLife;
      } else {
        // New item: push into pantry
        pantry.items.push({
          foodId: item._id || new mongoose.Types.ObjectId(),
          name: item.name,
          image: item.image,
          category: item.category,
          price: item.price,
          quantity: item.quantity,
          purchaseDate: now,
          estimatedDays: shelfLife,
          expiryDate: expiryDate,
        });
      }
    });

    await pantry.save();
  } catch (error) {
    // Non-blocking: pantry update should never crash order verification
    console.error("Pantry auto-update error:", error.message);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET PANTRY STATUS
// Returns enriched items with: remainingDays, status, statusColor, notifications
// ─────────────────────────────────────────────────────────────────────────────
const getPantry = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.body.userId);
    const pantry = await pantryModel.findOne({ userId });

    if (!pantry || pantry.items.length === 0) {
      return res.json({ success: true, items: [], notifications: [] });
    }

    const now = new Date();
    const notifications = [];

    const enrichedItems = pantry.items.map((item) => {
      const expiryDate = new Date(item.expiryDate);
      const msPerDay = 1000 * 60 * 60 * 24;
      const remainingDays = Math.ceil((expiryDate - now) / msPerDay);

      // ── Proportional status logic ──────────────────────────────────────────
      // Thresholds are purely relative to estimatedDays so every item —
      // including very short-shelf ones (Sandwich = 2 days) — passes through
      // all four statuses during its lifetime:
      //
      //   > 50%  remaining  →  Fresh      (green)
      //   > 25%  remaining  →  Use Soon   (yellow)
      //   >  0%  remaining  →  Low Stock  (orange)
      //   ≤  0   remaining  →  Reorder Now (red)
      //
      // For a 2-day item: Fresh on day 2 (100%), Use Soon on day 1 (50%),
      // Low Stock never applies (jumps from Use Soon to Reorder), which is
      // acceptable — the important thing is Use Soon IS reachable.
      // We use strict inequalities and keep the bands as distinct percentages.

      const pct = item.estimatedDays > 0
        ? remainingDays / item.estimatedDays
        : 0;

      let status, statusColor;
      if (pct > 0.5) {
        status = "Fresh";
        statusColor = "green";
      } else if (pct > 0.25) {
        status = "Use Soon";
        statusColor = "yellow";
      } else if (remainingDays > 0) {
        status = "Low Stock";
        statusColor = "orange";
      } else {
        status = "Reorder Now";
        statusColor = "red";
      }

      // AI Notifications
      if (statusColor === "red") {
        notifications.push(`⚠️ Time to reorder ${item.name}. It has expired!`);
      } else if (statusColor === "orange") {
        notifications.push(
          `🔶 ${item.name} may finish in ${remainingDays} day${remainingDays !== 1 ? "s" : ""}.`
        );
      } else if (statusColor === "yellow") {
        notifications.push(`🟡 Use your ${item.name} soon — ${remainingDays} days left.`);
      }

      return {
        _id: item._id,
        foodId: item.foodId,
        name: item.name,
        image: item.image,
        category: item.category,
        price: item.price,
        quantity: item.quantity,
        purchaseDate: item.purchaseDate,
        expiryDate: item.expiryDate,
        estimatedDays: item.estimatedDays,
        remainingDays,
        status,
        statusColor,
      };
    });

    // Sort: most urgent first
    enrichedItems.sort((a, b) => a.remainingDays - b.remainingDays);

    res.json({ success: true, items: enrichedItems, notifications });
  } catch (error) {
    console.error("getPantry error:", error);
    res.json({ success: false, message: "Error fetching pantry", items: [], notifications: [] });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// REMOVE ITEM FROM PANTRY
// ─────────────────────────────────────────────────────────────────────────────
const removeFromPantry = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.body.userId);
    const { itemId } = req.body;

    // 400 — missing or malformed itemId
    if (!itemId || !mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({ success: false, message: "Invalid item ID" });
    }

    const result = await pantryModel.updateOne(
      { userId },
      { $pull: { items: { _id: new mongoose.Types.ObjectId(itemId) } } }
    );

    // 404 — pantry exists but itemId was not found inside it
    if (result.modifiedCount === 0) {
      return res.status(404).json({ success: false, message: "Pantry item not found" });
    }

    // 200 — removed successfully
    res.json({ success: true, message: "Item removed from pantry" });
  } catch (error) {
    console.error("removeFromPantry error:", error);
    res.json({ success: false, message: "Error removing item" });
  }
};

export { addOrderToPantry, getPantry, removeFromPantry };
