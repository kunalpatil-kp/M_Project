import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./AIRecommendation.css";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";

const AIRecommendation = () => {
  const { url, token, addToCart, cartItems } = useContext(StoreContext);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (token) {
        try {
          const response = await axios.get(`${url}/api/recommendation`, {
            headers: { token },
          });
          if (response.data.success) {
            setRecommendations(response.data.recommendations);
          }
        } catch (error) {
          console.error("Error fetching AI recommendations:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false); // don't show if not logged in
      }
    };

    fetchRecommendations();
  }, [token, url]); // Removed cartItems to avoid inefficient API calls on every add/remove

  if (!token) return null; // Don't show recommendations if user is not logged in

  if (loading) {
    return (
      <div className="ai-recommendation-container">
        <h2 className="ai-title">✨ AI Smart Recommendations</h2>
        <p className="ai-subtitle">Analyzing your preferences...</p>
        <div className="ai-loader"></div>
      </div>
    );
  }

  // Filter out items already in the cart locally and limit to top 6
  const displayRecommendations = recommendations
    .filter((item) => !cartItems[item._id] || cartItems[item._id] === 0)
    .slice(0, 6);

  if (displayRecommendations.length === 0) {
    return null; // Don't show if no valid recommendations
  }

  return (
    <div className="ai-recommendation-container">
      <h2 className="ai-title">✨ AI Smart Recommendations</h2>
      <p className="ai-subtitle">Personalized picks just for you</p>

      <div className="ai-grid">
        {displayRecommendations.map((item) => (
          <div className="ai-card" key={item._id}>
            <div className="ai-card-badge">AI Recommended</div>
            <div className="ai-img-container">
              <img
                className="ai-card-img"
                src={`${url}/images/${item.image}`}
                alt={item.name}
              />
              <img
                className="ai-add"
                onClick={() => addToCart(item._id)}
                src={assets.add_icon_white}
                alt="add"
              />
            </div>
            <div className="ai-card-info">
              <div className="ai-card-header">
                <h3>{item.name}</h3>
                <span className="ai-price">₹{item.price}</span>
              </div>
              <p className="ai-category">{item.category}</p>
              <div className="ai-reason">
                <span className="reason-dot"></span>
                {item.reason}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIRecommendation;
