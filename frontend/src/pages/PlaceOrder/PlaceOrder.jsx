import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate, useLocation } from "react-router-dom";

const PlaceOrder = () => {
  const navigate = useNavigate();

  // Receive coupon data that Cart passed through router state
  const { state: routerState } = useLocation();
  const routerDiscount = routerState?.discount || 0;         // ₹ discount amount
  const routerCouponCode = routerState?.couponCode || "";    // e.g. "WELCOME10"

  const { getTotalCartAmount, token, food_list, cartItems, url } =
    useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // ── Computed totals ────────────────────────────────────────
  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal === 0 ? 0 : 2;
  // Final payable = subtotal − discount + delivery
  const finalTotal =
    subtotal === 0 ? 0 : Math.max(subtotal - routerDiscount, 0) + deliveryFee;

  const placeOrder = async (event) => {
    event.preventDefault();

    // Build order items array
    let orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        orderItems.push({ ...item, quantity: cartItems[item._id] });
      }
    });

    let orderData = {
      address: data,
      items: orderItems,
      // Send the discounted total (what Stripe should charge)
      amount: finalTotal,
      // Send couponCode so verifyOrder can increment usage after payment
      couponCode: routerCouponCode,
    };

    try {
      const response = await axios.post(url + "/api/order/place", orderData, {
        headers: { token },
      });

      if (response.data.success) {
        window.location.replace(response.data.session_url);
      } else {
        alert(response.data.message || "Error placing order");
      }
    } catch (error) {
      console.error("Order placement error:", error);
      alert("Unable to place order. Please try again.");
    }
  };

  // Redirect if not logged in or cart is empty
  useEffect(() => {
    if (!token) {
      navigate("/cart");
    } else if (getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [token, getTotalCartAmount, navigate]);

  return (
    <form onSubmit={placeOrder} className="place-order">
      {/* ── Delivery information ─────────────────────────────── */}
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input
            required
            name="firstName"
            onChange={onChangeHandler}
            value={data.firstName}
            type="text"
            placeholder="First name"
          />
          <input
            required
            name="lastName"
            onChange={onChangeHandler}
            value={data.lastName}
            type="text"
            placeholder="Last name"
          />
        </div>
        <input
          required
          name="email"
          onChange={onChangeHandler}
          value={data.email}
          type="email"
          placeholder="Email address"
        />
        <input
          required
          name="street"
          onChange={onChangeHandler}
          value={data.street}
          type="text"
          placeholder="Street"
        />
        <div className="multi-fields">
          <input
            required
            name="city"
            onChange={onChangeHandler}
            value={data.city}
            type="text"
            placeholder="City"
          />
          <input
            required
            name="state"
            onChange={onChangeHandler}
            value={data.state}
            type="text"
            placeholder="State"
          />
        </div>
        <div className="multi-fields">
          <input
            required
            name="zipcode"
            onChange={onChangeHandler}
            value={data.zipcode}
            type="text"
            placeholder="Zip code"
          />
          <input
            required
            name="country"
            onChange={onChangeHandler}
            value={data.country}
            type="text"
            placeholder="Country"
          />
        </div>
        <input
          required
          name="phone"
          onChange={onChangeHandler}
          value={data.phone}
          type="text"
          placeholder="Phone"
        />
      </div>

      {/* ── Order summary ────────────────────────────────────── */}
      <div className="place-order-right">
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

            {/* Discount row — only shown when a coupon was applied in Cart */}
            {routerDiscount > 0 && (
              <>
                <div className="cart-total-details">
                  <p>
                    Discount{" "}
                    {routerCouponCode && (
                      <span style={{ color: "green", fontSize: "12px" }}>
                        ({routerCouponCode})
                      </span>
                    )}
                  </p>
                  <p style={{ color: "green", fontWeight: "600" }}>
                    − ₹{routerDiscount}
                  </p>
                </div>
                <hr />
              </>
            )}

            <div className="cart-total-details">
              <b>Total</b>
              {/* Discounted total = what Stripe will charge */}
              <b>₹{finalTotal}</b>
            </div>
          </div>

          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
