import React, { useCallback, useContext, useEffect } from "react";
import axios from "axios";
import "./Verify.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const { url, setCartItems, resetCoupon, setToken } = useContext(StoreContext);
  const navigate = useNavigate();
  const verifyPayment = useCallback(async () => {
    try {
      console.log("[Verify] calling /api/order/verify — success:", success, "orderId:", orderId);
      const response = await axios.post(url + "/api/order/verify", {
        success,
        orderId,
      });
      console.log("[Verify] verify response:", response.data);
      if (response.data.success) {
        setCartItems({});
        resetCoupon();
        const savedToken = localStorage.getItem("token");
        console.log("[Verify] savedToken from localStorage:", savedToken ? "EXISTS" : "MISSING");
        if (savedToken) {
          setToken(savedToken);
        }
        navigate("/myorders");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      navigate("/");
    }
  }, [url, success, orderId, setCartItems, resetCoupon, setToken, navigate]);

  useEffect(() => {
    verifyPayment();
  }, [verifyPayment]);
  return (
    <div className="verify">
      <div className="spinner"></div>
    </div>
  );
};

export default Verify;
