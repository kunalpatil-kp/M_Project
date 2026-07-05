import React, { useContext, useEffect, useState } from "react";
import "./BudgetPlanner.css";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import BudgetSetup from "../BudgetSetup/BudgetSetup";
import BudgetDashboard from "./BudgetDashboard";
import ProgressBar from "./ProgressBar";

const BudgetPlanner = () => {
  const { url, token } = useContext(StoreContext);

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBudgetAnalytics = async () => {
    try {
      const response = await axios.get(`${url}/api/budget/analytics`, {
        headers: {
          token,
        },
      });

      if (response.data.success) {
        setAnalytics(response.data.analytics);
      } else {
        setAnalytics(null);
      }
    } catch (error) {
      console.log(error);
      setAnalytics(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (token) {
      fetchBudgetAnalytics();
    } else {
      setLoading(false);
    }
  }, [token]);

  if (!token) return null;

  if (loading) {
    return (
      <div className="budget-planner">
        <h2>Loading Budget Planner...</h2>
      </div>
    );
  }

  if (!analytics) {
    return <BudgetSetup onSuccess={fetchBudgetAnalytics} />;
  }

  return (
    <div className="budget-planner">

      <h2>🛒 Smart Grocery Budget Planner</h2>

      <BudgetDashboard analytics={analytics} />

      <ProgressBar percentage={analytics.budgetUsed} />

    </div>
  );
};

export default BudgetPlanner;