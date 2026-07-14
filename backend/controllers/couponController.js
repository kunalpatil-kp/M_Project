import couponModel from "../models/couponModel.js";
import mongoose from "mongoose";

// ──────────────────────────────────────────────
// CREATE COUPON  (admin use via Thunder Client / admin panel)
// ──────────────────────────────────────────────
const createCoupon = async (req, res) => {
  try {
    const {
      couponCode,
      discountType,
      discountValue,
      minimumOrder,
      expiryDate,
    } = req.body;

    // Required field checks
    if (!couponCode || !couponCode.trim()) {
      return res.json({ success: false, message: "Coupon code is required" });
    }
    if (!discountValue || Number(discountValue) <= 0) {
      return res.json({ success: false, message: "Discount value must be greater than 0" });
    }
    if (discountType === "PERCENTAGE" && Number(discountValue) > 100) {
      return res.json({ success: false, message: "Percentage discount cannot exceed 100%" });
    }
    if (!expiryDate || new Date(expiryDate) <= new Date()) {
      return res.json({ success: false, message: "Expiry date must be in the future" });
    }

    const coupon = new couponModel(req.body);
    await coupon.save();

    res.json({
      success: true,
      message: "Coupon Created Successfully",
    });
  } catch (error) {
    console.log(error);
    // Friendly duplicate key error instead of raw Mongoose message
    if (error.code === 11000) {
      return res.json({ success: false, message: "Coupon code already exists" });
    }
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// ──────────────────────────────────────────────
// VERIFY COUPON  (called from Cart page on "Apply")
// Only validates — does NOT consume usedCount here.
// usedCount is incremented only after successful Stripe payment (verifyOrder).
// ──────────────────────────────────────────────
const verifyCoupon = async (req, res) => {
  try {
    const { couponCode, amount } = req.body;

    if (!couponCode) {
      return res.json({ success: false, message: "Coupon Code is required" });
    }

    // Case-insensitive lookup
    const coupon = await couponModel.findOne({
      couponCode: couponCode.toUpperCase().trim(),
    });

    if (!coupon) {
      return res.json({ success: false, message: "Invalid Coupon Code" });
    }

    if (!coupon.active) {
      return res.json({ success: false, message: "Coupon is Disabled" });
    }

    // Expiry check
    if (new Date() > new Date(coupon.expiryDate)) {
      return res.json({ success: false, message: "Coupon has Expired" });
    }

    // Minimum order check
    if (Number(amount) < coupon.minimumOrder) {
      return res.json({
        success: false,
        message: `Minimum order of ₹${coupon.minimumOrder} required`,
      });
    }

    // Usage limit check (usageLimit === 0 means unlimited)
    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      return res.json({
        success: false,
        message: "Coupon Usage Limit Reached",
      });
    }

    // ── Calculate discount ──────────────────────
    let discount = 0;

    if (coupon.discountType === "PERCENTAGE") {
      discount = (Number(amount) * coupon.discountValue) / 100;

      // Apply max-discount cap if set
      if (coupon.maximumDiscount > 0 && discount > coupon.maximumDiscount) {
        discount = coupon.maximumDiscount;
      }
    } else {
      // FLAT discount — never exceed the cart amount
      discount = Math.min(coupon.discountValue, Number(amount));
    }

    discount = Math.round(discount * 100) / 100; // round to 2 dp

    const finalAmount = Math.max(Number(amount) - discount, 0);

    res.json({
      success: true,
      discount,
      finalAmount,
      couponCode: coupon.couponCode,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ──────────────────────────────────────────────
// INCREMENT USAGE  (called internally from orderController.verifyOrder)
// Only fires after Stripe confirms payment — so coupon is never consumed
// for failed/cancelled orders.
// ──────────────────────────────────────────────
const incrementCouponUsage = async (couponCode) => {
  try {
    if (!couponCode) return;
    await couponModel.findOneAndUpdate(
      { couponCode: couponCode.toUpperCase().trim() },
      { $inc: { usedCount: 1 } }
    );
  } catch (error) {
    // Non-fatal — log but don't break the verify flow
    console.log("[CouponUsage Error]", error.message);
  }
};

// ──────────────────────────────────────────────
// GET ALL COUPONS  (admin panel list)
// ──────────────────────────────────────────────
const getCoupons = async (req, res) => {
  try {
    const coupons = await couponModel.find();
    res.json({ success: true, data: coupons });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ──────────────────────────────────────────────
// DELETE COUPON  (admin panel)
// ──────────────────────────────────────────────
const deleteCoupon = async (req, res) => {
  try {
    // Validate ObjectId before hitting the database
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid coupon ID" });
    }

    const deleted = await couponModel.findByIdAndDelete(req.params.id);

    // Return 404 if the coupon didn't exist rather than a false success
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }

    res.json({ success: true, message: "Coupon Deleted" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { createCoupon, verifyCoupon, incrementCouponUsage, getCoupons, deleteCoupon };
