import orderModel from "../models/ordermodel.js";
import userModel from "../models/userModel.js";
import budgetModel from "../models/budgetModel.js";
import mongoose from "mongoose";
import Stripe from "stripe";
import { addOrderToPantry } from "./pantryController.js";
import { incrementCouponUsage } from "./couponController.js"; // coupon feature

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// placing user order for frontend

const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5173";
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

    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 2 * 100,
      },
      quantity: 1,
    });

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
  try {
    if (success == "true") {
      const order = await orderModel.findByIdAndUpdate(orderId, { payment: true }, { new: true });
      await userModel.findByIdAndUpdate(order.userId, { cartData: {} });
      
      // Auto-update budget analytics immediately upon successful order
      if (order && order.userId) {
        const budget = await budgetModel.findOne({ userId: new mongoose.Types.ObjectId(order.userId) });
        if (budget) {
          budget.currentSpent += order.amount;
          budget.remainingBudget = budget.monthlyBudget - budget.currentSpent;
          budget.budgetUsed = Number(((budget.currentSpent / budget.monthlyBudget) * 100).toFixed(2));
          await budget.save();
        }

        // Auto-populate pantry with purchased items (non-blocking)
        if (order.items && order.items.length > 0) {
          addOrderToPantry(order.userId.toString(), order.items);
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
    console.log(error);
    res.json({ success: false, message: "Error" });
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
