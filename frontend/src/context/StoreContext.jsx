import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

export const StoreContextProvider = (props) => {
  const url = "http://localhost:4000";

  const [food_list, setFoodList] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");

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
        setCartItems({});
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
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};