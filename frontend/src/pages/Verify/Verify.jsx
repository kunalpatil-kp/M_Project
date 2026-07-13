import React, { useCallback, useContext, useEffect } from "react";
import axios from "axios";
import "./Verify.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const { url, setCartItems, resetCoupon } = useContext(StoreContext);
  const navigate = useNavigate();
  const verifyPayment = useCallback(async () => {
    try {
      const response = await axios.post(url + "/api/order/verify", {
        success,
        orderId,
      });
      if (response.data.success) {
        setCartItems({});
        resetCoupon(); // coupon feature: clear discount state after successful payment
        navigate("/myorders");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      navigate("/");
    }
  }, [url, success, orderId, setCartItems, resetCoupon, navigate]);

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
