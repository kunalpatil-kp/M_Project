import React from "react";

const BudgetDashboard = ({ analytics }) => {
  return (
    <div className="budget-grid">

      <div className="budget-card">
        <h4>💰 Monthly Budget</h4>
        <h2>₹{analytics.monthlyBudget}</h2>
      </div>

      <div className="budget-card">
        <h4>🛒 Total Spent</h4>
        <h2>₹{analytics.spent}</h2>
      </div>

      <div className="budget-card">
        <h4>💵 Remaining</h4>
        <h2>₹{analytics.remaining}</h2>
      </div>

      <div className="budget-card">
        <h4>📦 Orders</h4>
        <h2>{analytics.totalOrders}</h2>
      </div>

      <div className="budget-card">
        <h4>👨‍👩‍👧 Family Size</h4>
        <h2>{analytics.familySize}</h2>
      </div>

      <div className="budget-card">
        <h4>Status</h4>
        <h2>{analytics.status}</h2>
      </div>

    </div>
  );
};

export default BudgetDashboard;