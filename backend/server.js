import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

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
  "http://localhost:4173",
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

// Rate Limiting — raised to 500 req/15 min per IP.
// On Render (and most PaaS), all traffic arrives through a reverse proxy, so
// req.ip would be the same internal IP for every user unless we tell Express
// to trust the X-Forwarded-For header.  We set app.set("trust proxy", 1) so
// express-rate-limit sees the real client IP and buckets users individually.
app.set("trust proxy", 1);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later." },
});
app.use("/api", limiter);

app.use(express.json({ limit: "10kb" }));

// Data Sanitization against NoSQL query injection (Express-5-compatible).
// express-mongo-sanitize 2.x tries to reassign req.query which is a
// read-only getter in Express 5 — crashes with "Cannot set property query".
// This replacement mutates the objects in-place instead of replacing them.
const sanitizeValue = (val) => {
  if (val && typeof val === "object" && !Array.isArray(val)) {
    for (const key of Object.keys(val)) {
      if (key.startsWith("$") || key.includes(".")) {
        delete val[key];
      } else {
        sanitizeValue(val[key]);
      }
    }
  } else if (Array.isArray(val)) {
    val.forEach(sanitizeValue);
  }
};

app.use((req, _res, next) => {
  if (req.body)   sanitizeValue(req.body);
  if (req.params) sanitizeValue(req.params);
  // req.query is read-only in Express 5 — sanitize its properties in-place
  if (req.query) {
    for (const key of Object.keys(req.query)) {
      if (key.startsWith("$") || key.includes(".")) {
        delete req.query[key];
      } else if (typeof req.query[key] === "object") {
        sanitizeValue(req.query[key]);
      }
    }
  }
  next();
});

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
