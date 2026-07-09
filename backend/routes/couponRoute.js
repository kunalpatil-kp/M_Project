import express from "express";
import {
  createCoupon,
  verifyCoupon,
  getCoupons,
  deleteCoupon,
} from "../controllers/couponController.js";

const couponRouter = express.Router();

// Admin: create a new coupon
couponRouter.post("/create", createCoupon);

// Cart page: verify & calculate discount (does NOT consume usage count)
couponRouter.post("/verify", verifyCoupon);

// Admin: list all coupons
couponRouter.get("/list", getCoupons);

// Admin: delete a coupon by id
couponRouter.delete("/delete/:id", deleteCoupon);

export default couponRouter;
