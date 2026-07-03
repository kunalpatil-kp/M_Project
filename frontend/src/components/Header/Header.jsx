import React from "react";
import "./Header.css";
const Header = () => {
  return (
    <div className="header">
      <div className="header-contents">
        <h2>Fresh Groceries Delivered to Your Door</h2>
        <p>
          Shop fresh produce, pantry essentials, and everyday staples with fast
          delivery and curated quality, all from a single convenient app.
        </p>
        <button>View Menu</button>
      </div>
    </div>
  );
};

export default Header;
