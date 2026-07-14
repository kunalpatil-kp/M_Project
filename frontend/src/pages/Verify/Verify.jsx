import React, { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import "./Verify.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const { url, setCartItems, resetCoupon, setToken, token } = useContext(StoreContext);
  const navigate = useNavigate();

  // Flag set after verify succeeds — we navigate only once token is committed to state.
  // This prevents the race condition where navigate("/myorders") fires before React
  // has committed setToken(savedToken), causing MyOrders to mount with token="" and
  // skip the fetchOrders call entirely.
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

  const verifyPayment = useCallback(async () => {
    try {
      const response = await axios.post(url + "/api/order/verify", {
        success,
        orderId,
      });
      if (response.data.success) {
        setCartItems({});
        resetCoupon();
        const savedToken = localStorage.getItem("token");
        if (savedToken) {
          setToken(savedToken);
          // Don't navigate yet — wait for token state to commit (see useEffect below)
          setVerifiedSuccess(true);
        } else {
          // No token — navigate immediately; MyOrders will show the login prompt
          navigate("/myorders");
        }
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

  // Navigate to /myorders only AFTER React has committed the token to context state.
  // MyOrders reads token from context on mount — if we navigate before it's committed,
  // MyOrders sees token="" on first render and never calls fetchOrders.
  useEffect(() => {
    if (verifiedSuccess && token) {
      navigate("/myorders");
    }
  }, [verifiedSuccess, token, navigate]);

  return (
    <div className="verify">
      <div className="spinner"></div>
    </div>
  );
};

export default Verify;
