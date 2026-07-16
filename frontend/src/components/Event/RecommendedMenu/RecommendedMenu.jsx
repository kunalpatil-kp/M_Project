// components/Event/RecommendedMenu/RecommendedMenu.jsx
// AI Event Ordering — boilerplate only, no business logic yet.

import React from "react";
import "./RecommendedMenu.css";

/**
 * RecommendedMenu — displays AI-generated menu items for an event.
 * Props:
 *   items: Array of food items recommended for the event
 *   loading: boolean
 */
const RecommendedMenu = ({ items = [], loading = false }) => {
  if (loading) {
    return (
      <div className="recommended-menu">
        <p className="recommended-menu-loading">⏳ Generating your menu...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="recommended-menu">
        <p className="recommended-menu-empty">
          Fill in your event details above to get AI-powered menu suggestions.
        </p>
      </div>
    );
  }

  return (
    <div className="recommended-menu">
      <h2 className="recommended-menu-title">🍽️ Recommended Menu</h2>
      <div className="recommended-menu-grid">
        {items.map((item, index) => (
          <div key={item._id || index} className="recommended-menu-card">
            <p className="recommended-menu-name">{item.name}</p>
            <p className="recommended-menu-category">{item.category}</p>
            <p className="recommended-menu-price">₹{item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedMenu;
