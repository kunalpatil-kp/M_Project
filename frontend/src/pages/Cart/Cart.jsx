import React, { useContext, useEffect } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Cart = () => {
  const {
    cartItems,
    food_list,
    removeFromCart,
    getTotalCartAmount,
    url,
    // Coupon state from StoreContext
    couponCode,
    setCouponCode,
    appliedCoupon,
    setAppliedCoupon,
    discount,
    setDiscount,
    resetCoupon,
  } = useContext(StoreContext);

  const navigate = useNavigate();

  // ── Reset coupon whenever cart contents change ──────────────
  // Prevents a stale discount from persisting after items are added/removed.
  useEffect(() => {
    resetCoupon();
  }, [cartItems]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Apply coupon ─────────────────────────────────────────────
  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    try {
      const response = await axios.post(`${url}/api/coupon/verify`, {
        couponCode: couponCode.trim(),
        amount: getTotalCartAmount(), // subtotal (before delivery)
      });

      if (response.data.success) {
        setDiscount(response.data.discount);
        setAppliedCoupon(couponCode.trim().toUpperCase());
        toast.success(`Coupon applied! You saved ₹${response.data.discount}`);
      } else {
        // Clear any previous discount on a failed attempt
        setDiscount(0);
        setAppliedCoupon("");
        toast.error(response.data.message || "Invalid coupon");
      }
    } catch (error) {
      console.log(error);
      toast.error("Unable to apply coupon. Please try again.");
    }
  };

  // ── Computed totals ──────────────────────────────────────────
  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal === 0 ? 0 : 2;
  // Final = subtotal − discount + delivery (discount can never exceed subtotal)
  const finalTotal = subtotal === 0 ? 0 : Math.max(subtotal - discount, 0) + deliveryFee;

  return (
    <div className="cart">
      {/* ── Cart item rows ───────────────────────────────────── */}
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />

        {food_list.map((item) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={item._id}>
                <div className="cart-items-title cart-items-item">
                  <img src={url + "/images/" + item.image} alt="" />
                  <p>{item.name}</p>
                  <p>₹{item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>₹{item.price * cartItems[item._id]}</p>
                  <p
                    onClick={() => removeFromCart(item._id)}
                    className="cross"
                  >
                    x
                  </p>
                </div>
                <hr />
              </div>
            );
          }
          return null;
        })}
      </div>

      <div className="cart-bottom">
        {/* ── Cart totals panel ─────────────────────────────── */}
        <div className="cart-total">
          <h2>Cart Totals</h2>

          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{subtotal}</p>
            </div>
            <hr />

            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{deliveryFee}</p>
            </div>
            <hr />

            {/* Discount row — only visible when a coupon is applied */}
            {discount > 0 && (
              <>
                <div className="cart-total-details">
                  <p>
                    Discount{" "}
                    <span style={{ color: "green", fontSize: "12px" }}>
                      ({appliedCoupon})
                    </span>
                  </p>
                  <p style={{ color: "green", fontWeight: "bold" }}>
                    − ₹{discount}
                  </p>
                </div>
                <hr />
              </>
            )}

            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{finalTotal}</b>
            </div>
          </div>

          {/* Pass coupon data to PlaceOrder via router state */}
          <button
            onClick={() =>
              navigate("/order", {
                state: {
                  couponCode: appliedCoupon,
                  discount,
                  finalAmount: subtotal - discount, // subtotal after discount (before delivery)
                },
              })
            }
          >
            PROCEED TO CHECKOUT
          </button>
        </div>

        {/* ── Coupon / promo code panel ─────────────────────── */}
        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, Enter it here</p>

            <div className="cart-promocode-input">
              <input
                type="text"
                placeholder="promo code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                // Disable input once coupon is successfully applied
                disabled={appliedCoupon !== ""}
              />

              {/* Disable Apply button once coupon is applied */}
              <button
                onClick={applyCoupon}
                disabled={appliedCoupon !== ""}
                style={
                  appliedCoupon
                    ? { background: "#22c55e", cursor: "default" }
                    : {}
                }
              >
                {appliedCoupon ? "Applied ✓" : "Submit"}
              </button>
            </div>

            {/* Coupon applied badge */}
            {appliedCoupon && (
              <p
                style={{
                  marginTop: "8px",
                  color: "green",
                  fontWeight: "600",
                  fontSize: "13px",
                }}
              >
                ✅ Coupon <strong>{appliedCoupon}</strong> applied — you saved ₹{discount}!
              </p>
            )}

            {/* Available coupons hint */}
            <p style={{ marginTop: "12px", fontSize: "13px", color: "#64748b" }}>
              <b>Available Coupons</b>
            </p>
            <p style={{ fontSize: "13px", color: "#64748b" }}>
              🎉 WELCOME10 → 10% OFF
            </p>
            <p style={{ fontSize: "13px", color: "#64748b" }}>
              💰 SAVE50 → Flat ₹50 OFF
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
