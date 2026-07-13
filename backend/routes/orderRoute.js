import express from "express";
import authMiddleware from "../middleware/auth.js";
import adminAuthMiddleware from "../middleware/adminAuth.js";
import { placeOrder,verifyOrder,userOrders,listOrders,updateStatus } from "../controllers/orderController.js";
import validateObjectId from "../middleware/validateObjectId.js";

const orderRouter = express.Router();

orderRouter.post("/place",authMiddleware,validateObjectId("userId"),placeOrder);
orderRouter.post("/verify",verifyOrder);
orderRouter.post("/userorders",authMiddleware,validateObjectId("userId"),userOrders);
orderRouter.get('/list',adminAuthMiddleware,listOrders);
orderRouter.post("/status",adminAuthMiddleware,validateObjectId("orderId"),updateStatus);
export default orderRouter;