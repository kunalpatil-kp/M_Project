import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

export const StoreContextProvider = (props) => {
  const url = "https://food-delivery-fquq.onrender.com";

  const [food_list, setFoodList] = useState([]);
  const [cartItems, setCartItems] = useState({});
  // Initialise synchronously from localStorage so protected pages that read
  // token on first render (SmartPantry, PlaceOrder) don't see "" and redirect
  // away before the async useEffect has a chance to restore it.
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // ── COUPON STATE ──────────────────────────────
  const [couponCode, setCouponCode] = useState("");       // what the user typed
  const [appliedCoupon, setAppliedCoupon] = useState(""); // confirmed coupon code
  const [discount, setDiscount] = useState(0);            // discount amount in ₹

  // ---------------- ADD TO CART ----------------

  const addToCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));

    try {
      if (token) {
        await axios.post(
          `${url}/api/cart/add`,
          { itemId },
          {
            headers: { token },
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ---------------- REMOVE FROM CART ----------------

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: Math.max((prev[itemId] || 1) - 1, 0),
    }));

    try {
      if (token) {
        await axios.post(
          `${url}/api/cart/remove`,
          { itemId },
          {
            headers: { token },
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ---------------- TOTAL CART ----------------

  const getTotalCartAmount = () => {
    let totalAmount = 0;

    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = food_list.find(
          (product) => product._id === item
        );

        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }

    return totalAmount;
  };

  // ── RESET COUPON  (call whenever cart changes) ─
  // Clears all coupon state so a stale discount is never carried forward.
  const resetCoupon = () => {
    setCouponCode("");
    setAppliedCoupon("");
    setDiscount(0);
  };

  // ---------------- FOOD LIST ----------------

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);

      if (response.data.success) {
        setFoodList(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ---------------- CART DATA ----------------

  const loadCartData = async (currentToken) => {
    try {
      const response = await axios.post(
        `${url}/api/cart/get`,
        {},
        {
          headers: {
            token: currentToken,
          },
        }
      );

      if (response.data.success) {
        setCartItems(response.data.cartData || {});
      } else {
        // Token is expired or invalid — clear it so the user is shown the login prompt
        setCartItems({});
        setToken("");
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.log(error);
      setCartItems({});
    }
  };

  // ---------------- INITIAL LOAD ----------------

  useEffect(() => {
    const loadData = async () => {
      await fetchFoodList();

      const savedToken = localStorage.getItem("token");

      if (savedToken) {
        // token is already set synchronously in useState above;
        // only call setToken here in case it was cleared elsewhere mid-session.
        setToken(savedToken);
        await loadCartData(savedToken);
      }
    };

    loadData();
  }, []);

  // ---------------- CONTEXT ----------------

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    // ── Coupon ────────────────────────────────
    couponCode,
    setCouponCode,
    appliedCoupon,
    setAppliedCoupon,
    discount,
    setDiscount,
    resetCoupon,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};