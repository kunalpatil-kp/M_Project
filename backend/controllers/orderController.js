import orderModel from "../models/ordermodel.js";
import userModel from "../models/userModel.js";
import budgetModel from "../models/budgetModel.js";
import mongoose from "mongoose";
import Stripe from "stripe";
import { addOrderToPantry } from "./pantryController.js";
import { incrementCouponUsage } from "./couponController.js"; // coupon feature


// placing user order for frontend

const placeOrder = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const frontend_url =
    process.env.FRONTEND_URL || "https://food-delivery-frontend-9pel.onrender.com";
  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      // Store couponCode so verifyOrder can increment usage count on payment success
      couponCode: req.body.couponCode || "",
    });
    await newOrder.save();

    // Use req.body.amount (the discounted total already including delivery)
    // as the single Stripe line item so Stripe charges exactly what the
    // customer sees in the UI — no more/less than the discounted total.
    const line_items = [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: "Fresh Grocery Order",
          },
          unit_amount: Math.round(req.body.amount * 100), // convert ₹ → paise
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });
    
    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("[Stripe API Error Details]:", {
      message: error.message,
      type: error.type,
      raw: error.raw,
      statusCode: error.statusCode,
      stack: error.stack
    });
    res.json({ success: false, message: error.message || "Error" });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;

  if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
    return res.status(400).json({ success: false, message: "Invalid order ID" });
  }

  try {
    if (success == "true") {
      const order = await orderModel.findByIdAndUpdate(orderId, { payment: true }, { new: true });

      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      await userModel.findByIdAndUpdate(order.userId, { cartData: {} });
      
      // Auto-update budget analytics immediately upon successful order
      if (order && order.userId) {
        const budget = await budgetModel.findOne({ userId: new mongoose.Types.ObjectId(order.userId) });
        if (budget) {
          budget.currentSpent += order.amount;
          // Clamp so stored values never go negative or exceed 100%
          budget.remainingBudget = Math.max(budget.monthlyBudget - budget.currentSpent, 0);
          budget.budgetUsed = Number(
            Math.min((budget.currentSpent / budget.monthlyBudget) * 100, 100).toFixed(2)
          );
          await budget.save();
        }

        // Auto-populate pantry with purchased items.
        // Wrapped in a self-executing async so errors never block the verify response,
        // but the work is still initiated before res.json() so Render doesn't kill it.
        if (order.items && order.items.length > 0) {
          addOrderToPantry(order.userId.toString(), order.items).catch((err) =>
            console.error("Pantry async error:", err.message)
          );
        }

        // Increment coupon usage count only after confirmed payment
        if (order.couponCode) {
          await incrementCouponUsage(order.couponCode);
        }
      }

      res.json({ success: true, message: "Paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

//user orders for frontend
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};
// Listing orders for admin panel

const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};
// api for order status
const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};
export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
