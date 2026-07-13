import express from "express";
import {
  createCoupon,
  verifyCoupon,
  getCoupons,
  deleteCoupon,
} from "../controllers/couponController.js";
import adminAuthMiddleware from "../middleware/adminAuth.js";

const couponRouter = express.Router();

// Admin: create a new coupon
couponRouter.post("/create", adminAuthMiddleware, createCoupon);

// Cart page: verify & calculate discount — public, no admin token required
couponRouter.post("/verify", verifyCoupon);

// Admin: list all coupons
couponRouter.get("/list", adminAuthMiddleware, getCoupons);

// Admin: delete a coupon by id
couponRouter.delete("/delete/:id", adminAuthMiddleware, deleteCoupon);

export default couponRouter;
