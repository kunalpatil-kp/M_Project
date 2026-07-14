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
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

  const verifyPayment = useCallback(async () => {
    try {
      console.log("[Verify] calling verify — success:", success, "orderId:", orderId);
      const response = await axios.post(url + "/api/order/verify", { success, orderId });
      console.log("[Verify] verify response:", JSON.stringify(response.data));
      if (response.data.success) {
        setCartItems({});
        resetCoupon();
        const savedToken = localStorage.getItem("token");
        console.log("[Verify] localStorage token:", savedToken ? "EXISTS" : "MISSING");
        console.log("[Verify] context token before setToken:", token ? "EXISTS" : "EMPTY");
        if (savedToken) {
          setToken(savedToken);
          setVerifiedSuccess(true);
        } else {
          navigate("/myorders");
        }
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("[Verify] error:", error);
      navigate("/");
    }
  }, [url, success, orderId, setCartItems, resetCoupon, setToken, navigate, token]);

  useEffect(() => {
    verifyPayment();
  }, [verifyPayment]);

  useEffect(() => {
    console.log("[Verify] nav-gate — verifiedSuccess:", verifiedSuccess, "| token:", token ? "EXISTS" : "EMPTY");
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
