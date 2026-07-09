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
import couponRouter from "./routes/couponRoute.js"; // coupon feature
// app config
const app = express();
const port = 4000;

// middleware
app.use(express.json());
app.use(cors());

// db connection
connectDB();

//api endpoints

app.use("/api/food",foodRouter);
app.use("/images",express.static('uploads'));
app.use("/api/user",userRouter);
app.use("/api/cart",cartRouter);
app.use("/api/order",orderRouter);
app.use("/api/budget", budgetRouter);
app.use("/api/recommendation", recommendedRouter);
app.use("/api/pantry", pantryRouter);
app.use("/api/coupon", couponRouter); // coupon feature
app.get("/", (req, res) => {
  res.send("API Working"); // thunder client extenstion for check which api
  // working
});

app.listen(port, () => {
  console.log(`Server Listening on http://localhost:${port}`);
  const key = process.env.STRIPE_SECRET_KEY;
  const maskedKey = key ? (key.startsWith("sk_") ? `${key.slice(0, 7)}...${key.slice(-4)}` : `${key.slice(0, 5)}...`) : "UNDEFINED";
  console.log(`[Stripe Config] STRIPE_SECRET_KEY loaded: ${maskedKey}`);
});

// mongodb+srv://kunalpatil56568_db_user:Sergio111@cluster0.pbve9kj.mongodb.net/?appName=Cluster0
