import React, { useContext, useState, useEffect } from "react";
import "./BudgetSetup.css";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";

const BudgetSetup = ({ onSuccess, initialData = null }) => {
  const { url, token } = useContext(StoreContext);
  
  // Track mode internally so it can switch if it fetches an existing budget
  const [isUpdateMode, setIsUpdateMode] = useState(!!initialData);

  const [monthlyBudget, setMonthlyBudget] = useState(initialData ? initialData.monthlyBudget : "");
  const [familySize, setFamilySize] = useState(initialData ? initialData.familySize : 1);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // Automatically fetch budget on load to prevent duplicate POSTs
  useEffect(() => {
    if (initialData || !token) return;

    const fetchExistingBudget = async () => {
      setFetching(true);
      try {
        const response = await axios.get(`${url}/api/budget/get`, {
          headers: { token },
        });
        
        if (response.data.success && response.data.data) {
          // Budget exists! Switch to update mode and prefill
          setIsUpdateMode(true);
          setMonthlyBudget(response.data.data.monthlyBudget);
          setFamilySize(response.data.data.familySize);
        }
      } catch (error) {
        console.error("[BudgetSetup] Error fetching existing budget:", error);
      } finally {
        setFetching(false);
      }
    };

    fetchExistingBudget();
  }, [token, url, initialData]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Please login to save your budget.");
      return;
    }

    if (!monthlyBudget || Number(monthlyBudget) <= 0) {
      alert("Enter a valid Monthly Budget (must be greater than 0)");
      return;
    }

    if (Number(monthlyBudget) < 100) {
      alert("Monthly Budget must be at least ₹100");
      return;
    }

    try {
      setLoading(true);
      let response;

      const payload = {
        monthlyBudget: Number(monthlyBudget),
        familySize: Number(familySize),
      };

      const config = {
        headers: { token },
      };

      if (isUpdateMode) {
        console.log("[BudgetSetup] Sending PUT /api/budget/update", payload);
        response = await axios.put(`${url}/api/budget/update`, payload, config);
      } else {
        console.log("[BudgetSetup] Sending POST /api/budget/create", payload);
        response = await axios.post(`${url}/api/budget/create`, payload, config);
      }

      if (response.data.success) {
        // Success handling
        if (!isUpdateMode) {
          // Switch to update mode immediately after create so subsequent saves are PUT
          setIsUpdateMode(true); 
        }
        onSuccess();
      } else {
        console.warn("[BudgetSetup] Server returned error:", response.data.message);
        alert(response.data.message || "Failed to save budget. Please try again.");
      }
    } catch (error) {
      console.error("[BudgetSetup] FULL ERROR:", error);

      if (error.response) {
        alert(error.response.data?.message || "Backend Error occurred");
      } else if (error.request) {
        alert("Cannot reach server. Is the backend running on port 4000?");
      } else {
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="budget-setup">
        <h2>Loading Budget Data...</h2>
      </div>
    );
  }

  return (
    <div className="budget-setup">
      <form className="budget-form" onSubmit={submitHandler}>
        <h2>{isUpdateMode ? "✏️ Update Monthly Budget" : "🛒 Setup Monthly Budget"}</h2>

        <input
          type="number"
          placeholder="Monthly Budget (₹) — minimum ₹100"
          value={monthlyBudget}
          min="100"
          onChange={(e) => setMonthlyBudget(e.target.value)}
        />

        <select
          value={familySize}
          onChange={(e) => setFamilySize(Number(e.target.value))}
        >
          {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
            <option key={num} value={num}>
              {num} Member{num > 1 ? "s" : ""}
            </option>
          ))}
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : (isUpdateMode ? "Update Budget" : "Save Budget")}
        </button>
      </form>
    </div>
  );
};

export default BudgetSetup;
