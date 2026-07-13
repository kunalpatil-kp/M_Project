import jwt from "jsonwebtoken";

const adminAuthMiddleware = async (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access denied. Admin login required." });
  }

  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);

    // A customer JWT has { id: userId }. An admin JWT has { role: "admin" }.
    // This check ensures a customer token can NEVER be used to access admin routes.
    if (token_decode.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden. Admin privileges required." });
    }

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token. Please login again." });
  }
};

export default adminAuthMiddleware;
