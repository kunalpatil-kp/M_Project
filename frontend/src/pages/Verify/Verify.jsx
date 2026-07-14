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
      const response = await axios.post(url + "/api/order/verify", {
        success,
        orderId,
      });
      if (response.data.success) {
        setCartItems({});
        resetCoupon(); // coupon feature: clear discount state after successful payment
        // On a fresh page load (Stripe redirect), StoreContext's async useEffect may
        // not have restored the token yet. Restore it from localStorage now so that
        // /myorders (which guards on token) doesn't bounce the user away.
        const savedToken = localStorage.getItem("token");
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
