import React, { useContext, useState } from "react";
import "./BudgetSetup.css";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";

const BudgetSetup = ({ onSuccess }) => {
  const { url, token } = useContext(StoreContext);

  const [monthlyBudget, setMonthlyBudget] = useState("");
  const [familySize, setFamilySize] = useState(1);
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!monthlyBudget) {
      alert("Enter Monthly Budget");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${url}/api/budget/create`,
        {
          monthlyBudget: Number(monthlyBudget),
          familySize,
        },
        {
          headers: {
            token,
          },
        },
      );
      if (response.data.success) {
        alert("Budget Created Successfully");
        setMonthlyBudget("");
        setFamilySize(1);
        onSuccess();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log("FULL ERROR:", error);

      if (error.response) {
        console.log("Backend Response:", error.response.data);
        alert(error.response.data.message || "Backend Error");
      } else {
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="budget-setup">
      <form className="budget-form" onSubmit={submitHandler}>
        <h2>🛒 Setup Monthly Budget</h2>

        <input
          type="number"
          placeholder="Monthly Budget (₹)"
          value={monthlyBudget}
          onChange={(e) => setMonthlyBudget(e.target.value)}
        />

        <select
          value={familySize}
          onChange={(e) => setFamilySize(Number(e.target.value))}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
            <option key={num} value={num}>
              {num} Member{num > 1 ? "s" : ""}
            </option>
          ))}
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Budget"}
        </button>
      </form>
    </div>
  );
};

export default BudgetSetup;
