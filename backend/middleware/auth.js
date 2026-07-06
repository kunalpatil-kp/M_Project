import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  const { token } = req.headers;

  console.log("[auth] Token received:", token ? "YES (length: " + token.length + ")" : "MISSING");

  if (!token) {
    console.log("[auth] No token — rejecting request");
    return res.json({ success: false, message: "Not Authorized Login Again" });
  }

  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log("[auth] Token decoded. userId:", token_decode.id);
    
    // Express may leave req.body undefined for GET requests. We must initialize it safely.
    if (!req.body) {
      req.body = {};
    }
    
    req.body.userId = token_decode.id;
    next();
  } catch (error) {
    console.log("[auth] JWT verification FAILED:", error.message);
    res.json({ success: false, message: "Invalid Token. Please login again." });
  }
};

export default authMiddleware;