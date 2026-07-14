import React, { useCallback, useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";
import generateInvoice from "../../utils/invoiceGenerator";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    if (!token) {
      console.log("[MyOrders] fetchOrders skipped — no token");
      return;
    }
    console.log("[MyOrders] fetchOrders — token:", token.slice(0, 20) + "...");
    setLoading(true);
    try {
      const response = await axios.post(
        url + "/api/order/userorders",
        {},
        { headers: { token } },
      );
      console.log("[MyOrders] response status:", response.status);
      console.log("[MyOrders] response data:", JSON.stringify(response.data));
      if (response.data.success && response.data.data) {
        console.log("[MyOrders] setting", response.data.data.length, "orders");
        setData(response.data.data);
      } else {
        console.log("[MyOrders] success=false or no data:", response.data);
      }
    } catch (error) {
      console.error("[MyOrders] fetch error:", error.response?.status, error.message);
    } finally {
      setLoading(false);
    }
  }, [url, token]);

  useEffect(() => {
    console.log("[MyOrders] useEffect — token:", token ? token.slice(0, 20) + "..." : "EMPTY");
    if (token) {
      fetchOrders();
    }
  }, [token, fetchOrders]);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="container">
        {!token ? (
          <p>Please login to view your orders.</p>
        ) : loading ? (
          <p>Loading your orders...</p>
        ) : data.length === 0 ? (
          <p>You have no orders yet.</p>
        ) : (
          data.map((order, index) => (
            <div key={order._id || index} className="my-orders-order">
              <img src={assets.parcel_icon} alt="parcel" />
              <p>
                {order.items.map((item, itemIndex) => (
                  <span key={itemIndex}>
                    {item.name} x {item.quantity}
                    {itemIndex < order.items.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
              <p>₹{order.amount}.00</p>
              <p>Items: {order.items.length}</p>
              <p>
                <span>&#x25cf;</span> <b>{order.status}</b>
              </p>
              <div className="order-buttons">
                <button onClick={fetchOrders}>Track Order</button>
                <button
                  className="invoice-btn"
                  onClick={() => generateInvoice(order)}
                >
                  Download Invoice
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyOrders;
