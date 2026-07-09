import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    couponCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    // "PERCENTAGE" or "FLAT"
    discountType: {
      type: String,
      enum: ["PERCENTAGE", "FLAT"],
      default: "PERCENTAGE",
    },

    // Percentage value (e.g. 10 for 10%) or flat amount (e.g. 50 for ₹50)
    discountValue: {
      type: Number,
      required: true,
    },

    // Max discount cap when discountType is PERCENTAGE (0 = no cap)
    maximumDiscount: {
      type: Number,
      default: 0,
    },

    // Minimum cart subtotal required to use this coupon
    minimumOrder: {
      type: Number,
      required: true,
      default: 0,
    },

    // How many times this coupon can be used in total (0 = unlimited)
    usageLimit: {
      type: Number,
      default: 0,
    },

    // Counter incremented on every successful payment (verifyOrder)
    usedCount: {
      type: Number,
      default: 0,
    },

    expiryDate: {
      type: Date,
      required: true,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const couponModel =
  mongoose.models.coupon || mongoose.model("coupon", couponSchema);

export default couponModel;
