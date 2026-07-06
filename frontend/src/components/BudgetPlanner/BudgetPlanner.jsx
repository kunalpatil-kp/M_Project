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
  const [hasBudget, setHasBudget] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const fetchData = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    
    // We only show full-screen loader on initial mount.
    // For background refreshes (like after a submit), we don't block the UI.
    if (!hasBudget && !analytics) {
      setLoading(true);
    }
    
    try {
      // 1. Fetch budget to check if it exists
      const budgetRes = await axios.get(`${url}/api/budget/get`, {
        headers: { token },
      });

      if (budgetRes.data.success && budgetRes.data.data) {
        setHasBudget(true);
        // 2. Fetch the latest analytics
        const analyticsRes = await axios.get(`${url}/api/budget/analytics`, {
          headers: { token },
        });

        if (analyticsRes.data.success) {
          setAnalytics(analyticsRes.data.analytics);
        } else {
          setAnalytics(null);
        }
      } else {
        setHasBudget(false);
        setAnalytics(null);
      }
    } catch (error) {
      console.error("Error fetching budget data:", error);
      setHasBudget(false);
      setAnalytics(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) {
      fetchData();
    } else {
      setHasBudget(false);
      setAnalytics(null);
      setLoading(false);
      setIsEditing(false);
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

  // Show setup form if we don't have a budget OR if the user explicitly clicked "Edit"
  if (!hasBudget || !analytics || isEditing) {
    return (
      <BudgetSetup 
        initialData={isEditing && analytics ? analytics : null} 
        onSuccess={async () => {
          setIsEditing(false); // Instantly turn off edit mode
          await fetchData();   // Fetch fresh dashboard data to show immediately
        }} 
      />
    );
  }

  // Dashboard View
  return (
    <div className="budget-planner">
      <h2>🛒 Smart Grocery Budget Planner</h2>
      <BudgetDashboard analytics={analytics} onEdit={() => setIsEditing(true)} />
      <ProgressBar percentage={analytics.budgetUsed} />
    </div>
  );
};

export default BudgetPlanner;