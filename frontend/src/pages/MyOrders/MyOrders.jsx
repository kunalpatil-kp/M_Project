import React, { useCallback, useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";
import generateInvoice from "../../utils/invoiceGenerator";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.post(
        url + "/api/order/userorders",
        {},
        { headers: { token } },
      );
      if (response.data.success && response.data.data) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }, [url, token]);

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token, fetchOrders]);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="container">
        {data.map((order, index) => (
          <div key={order._id || index} className="my-orders-order">
            <img src={assets.parcel_icon} alt="" />
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
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
