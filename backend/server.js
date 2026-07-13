import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import budgetRouter from "./routes/budgetRoute.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import recommendedRouter from "./routes/recommendedRoute.js";
import pantryRouter from "./routes/pantryRoute.js";
import couponRouter from "./routes/couponRoute.js";

// app config
const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "https://food-delivery-fquq.onrender.com",
      "https://food-delivery-admin-fquq.onrender.com",
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
  })
);

// db connection
connectDB();

// api endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/budget", budgetRouter);
app.use("/api/recommendation", recommendedRouter);
app.use("/api/pantry", pantryRouter);
app.use("/api/coupon", couponRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => {
  console.log(`Server Listening on port ${port}`);
  const key = process.env.STRIPE_SECRET_KEY;
  const maskedKey = key
    ? key.startsWith("sk_")
      ? `${key.slice(0, 7)}...${key.slice(-4)}`
      : `${key.slice(0, 5)}...`
    : "UNDEFINED";
  console.log(`[Stripe Config] STRIPE_SECRET_KEY loaded: ${maskedKey}`);
});
