import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";

import { connectDB } from "./config/db.js";

import budgetRouter from "./routes/budgetRoute.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import recommendedRouter from "./routes/recommendedRoute.js";
import pantryRouter from "./routes/pantryRoute.js";
import couponRouter from "./routes/couponRoute.js";

// =======================
// APP CONFIG
// =======================

const app = express();
const port = process.env.PORT || 4000;

// =======================
// DATABASE
// =======================

connectDB();

// =======================
// MIDDLEWARE
// =======================

// Allowed Origins — hardcoded production URLs are fallbacks in case env vars are not set
const allowedOrigins = [
  // Production URLs (hardcoded fallbacks)
  "https://food-delivery-frontend-9pel.onrender.com",
  "https://food-delivery-admin-gssu.onrender.com",
  // From environment variables (overrides / additions)
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  // Local development
  "http://localhost:5173",
  "http://localhost:5174",
].filter(Boolean); // removes undefined/null if env vars are not set

// CORS Configuration — must be registered BEFORE other middleware so that
// preflight OPTIONS requests receive the correct headers immediately.
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without origin (Postman, server-to-server, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("Blocked by CORS:", origin);

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Security Headers
app.use(helmet({
  crossOriginResourcePolicy: false, // allow images to load cross-origin
}));

// Rate Limiting (100 requests per 15 minutes per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later." },
});
app.use("/api", limiter);

app.use(express.json({ limit: "10kb" }));

// Data Sanitization against NoSQL query injection
// Note: Placed AFTER express.json() so req.body exists.
app.use(mongoSanitize({
  replaceWith: '_',
}));

// =======================
// STATIC FOLDER
// =======================

app.use("/images", express.static("uploads"));

// =======================
// ROUTES
// =======================

app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/budget", budgetRouter);
app.use("/api/recommendation", recommendedRouter);
app.use("/api/pantry", pantryRouter);
app.use("/api/coupon", couponRouter);

// =======================
// ROOT
// =======================

app.get("/", (req, res) => {
  res.send("API Working 🚀");
});

// =======================
// GLOBAL ERROR HANDLER
// =======================

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// =======================
// SERVER
// =======================

app.listen(port, () => {
  console.log(`🚀 Server Running on Port ${port}`);

  const key = process.env.STRIPE_SECRET_KEY;
  const maskedKey = key
    ? key.startsWith("sk_")
      ? `${key.slice(0, 7)}...${key.slice(-4)}`
      : `${key.slice(0, 5)}...`
    : "UNDEFINED ❌";
  console.log(`✅ Stripe Key Loaded: ${maskedKey}`);

  // --- Startup Environment Diagnostic ---
  const envVars = [
    "JWT_SECRET",
    "STRIPE_SECRET_KEY",
    "MONGODB_URI",
    "ADMIN_EMAIL",
    "ADMIN_PASSWORD",
    "FRONTEND_URL",
    "ADMIN_URL",
  ];
  console.log("\n🔍 Environment Variable Check:");
  envVars.forEach((v) => {
    if (process.env[v]) {
      console.log(`  ✅ ${v}: SET`);
    } else {
      console.log(`  ❌ ${v}: MISSING — add to Render dashboard!`);
    }
  });
  console.log("");
});