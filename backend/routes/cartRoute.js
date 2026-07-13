import express from "express";
import {
  addToCart,
  removeFromCart,
  getCart,
} from "../controllers/cartController.js";
import authMiddleware from "../middleware/auth.js";
import validateObjectId from "../middleware/validateObjectId.js";

const cartRouter = express.Router();

cartRouter.post("/add", authMiddleware, validateObjectId("userId"), validateObjectId("itemId"), addToCart);
cartRouter.post("/remove", authMiddleware, validateObjectId("userId"), validateObjectId("itemId"), removeFromCart);
cartRouter.post("/get", authMiddleware, validateObjectId("userId"), getCart);

export default cartRouter;
