import React from "react";
import "./Header.css";

const Header = () => {
  const handleViewMenu = () => {
    const section = document.getElementById("explore-menu");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="header">
      <div className="header-contents">
        <h2>Fresh Groceries Delivered to Your Door</h2>
        <p>
          Shop fresh fruits, vegetables, dairy products, grains, snacks,
          beverages, and everyday essentials from one trusted grocery
          destination. Enjoy premium quality products, affordable prices, secure
          payments, and lightning-fast doorstep delivery.
        </p>
        <button onClick={handleViewMenu}>View Menu</button>
      </div>
    </div>
  );
};

export default Header;
