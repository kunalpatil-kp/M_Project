import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./EventOrdering.css";
import { StoreContext } from "../../context/StoreContext";

// ─── Constants ───────────────────────────────────────────────────────────────

const INITIAL_FORM = {
  eventType:          "",
  guestCount:         "",
  budget:             "",
  foodPreference:     "Veg",
  mealType:           "",
  spiceLevel:         "",
  specialRequirement: "",
};

const SECTION_EMOJI = {
  Starter:       "🥗",
  "Main Course": "🍛",
  Dessert:       "🍮",
  Drink:         "🥤",
  Other:         "🍽️",
};

// ─── Component ───────────────────────────────────────────────────────────────

const EventOrdering = () => {
  const { url, token, addToCart } = useContext(StoreContext);
  const navigate = useNavigate();

  const [formData,       setFormData]       = useState(INITIAL_FORM);
  const [loading,        setLoading]        = useState(false);
  const [cartAdded,      setCartAdded]      = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [event,          setEvent]          = useState(null);
  const [validationErr,  setValidationErr]  = useState({});

  // ── Validation ─────────────────────────────────────────────────────────────
  const validate = () => {
    const errors = {};
    if (!formData.eventType)
      errors.eventType = "Please select an event type.";
    if (!formData.guestCount || Number(formData.guestCount) <= 0)
      errors.guestCount = "Guest count must be greater than 0.";
    if (!formData.budget || Number(formData.budget) <= 100)
      errors.budget = "Budget must be greater than ₹100.";
    if (!formData.foodPreference)
      errors.foodPreference = "Please select a food preference.";
    if (!formData.mealType)
      errors.mealType = "Please select a meal type.";
    return errors;
  };

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear the validation error for this field as the user types
    if (validationErr[name]) {
      setValidationErr((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Shared generate logic — used by both initial submit and "Generate Again"
  const generateMenu = async () => {
    setLoading(true);
    setCartAdded(false);
    try {
      const response = await axios.post(
        `${url}/api/event/generate`,
        {
          eventType:          formData.eventType,
          guestCount:         formData.guestCount,
          budget:             formData.budget,
          foodPreference:     formData.foodPreference,
          mealType:           formData.mealType,
          spiceLevel:         formData.spiceLevel,
          specialRequirement: formData.specialRequirement,
        },
        { headers: { token } }
      );

      if (response.data.success) {
        setRecommendation(response.data.recommendation);
        setEvent(response.data.event);
      } else {
        toast.error(response.data.message || "Failed to generate menu. Please try again.");
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setValidationErr(errors);
      return;
    }
    setValidationErr({});
    setRecommendation(null);
    setEvent(null);
    await generateMenu();
  };

  const handleGenerateAgain = async () => {
    if (loading) return; // prevent duplicate clicks
    setRecommendation(null);
    setEvent(null);
    await generateMenu();
  };

  // Feature 1 — Add entire generated menu to cart using existing addToCart()
  const handleAddToCart = () => {
    if (!recommendation?.generatedMenu?.length) return;
    recommendation.generatedMenu.forEach((item) => {
      // addToCart() expects the food's MongoDB _id.
      // Call it `quantity` times so the cart count matches the recommended qty.
      for (let i = 0; i < item.quantity; i++) {
        addToCart(item._id.toString());
      }
    });
    setCartAdded(true);
    toast.success("AI Menu added to cart successfully! 🛒");
  };

  // ── Group menu items by section (derived, no extra state needed) ───────────
  const groupedSections = recommendation?.generatedMenu?.length
    ? recommendation.generatedMenu.reduce((acc, item) => {
        const sec = item.section || "Other";
        if (!acc[sec]) acc[sec] = [];
        acc[sec].push(item);
        return acc;
      }, {})
    : null;

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="eo-page">

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="eo-header">
        <div className="eo-header-icon">🎉</div>
        <h1 className="eo-header-title">AI Event Planner</h1>
        <p className="eo-header-subtitle">
          Generate the perfect menu for your event.
        </p>
      </div>

      {/* ── Form card ────────────────────────────────────────────────────── */}
      <div className="eo-card">
        <form className="eo-form" onSubmit={handleSubmit} noValidate>

          {/* Event Type */}
          <div className="eo-field">
            <label className="eo-label" htmlFor="eventType">Event Type</label>
            <div className="eo-select-wrap">
              <select
                id="eventType"
                name="eventType"
                className="eo-select"
                value={formData.eventType}
                onChange={handleChange}
              >
                <option value="" disabled>Select event type</option>
                <option value="Birthday">Birthday</option>
                <option value="Office Party">Office Party</option>
                <option value="Wedding">Wedding</option>
                <option value="College Event">College Event</option>
                <option value="Friends Party">Friends Party</option>
                <option value="Family Function">Family Function</option>
              </select>
            </div>
            {validationErr.eventType && (
              <span style={{ fontSize: "0.8rem", color: "#ef4444" }}>
                {validationErr.eventType}
              </span>
            )}
          </div>

          {/* Guest Count + Budget */}
          <div className="eo-row-2">
            <div className="eo-field">
              <label className="eo-label" htmlFor="guestCount">Guest Count</label>
              <input
                id="guestCount"
                name="guestCount"
                type="number"
                className="eo-input"
                placeholder="e.g. 50"
                min="1"
                value={formData.guestCount}
                onChange={handleChange}
              />
              {validationErr.guestCount && (
                <span style={{ fontSize: "0.8rem", color: "#ef4444" }}>
                  {validationErr.guestCount}
                </span>
              )}
            </div>

            <div className="eo-field">
              <label className="eo-label" htmlFor="budget">Budget (₹)</label>
              <input
                id="budget"
                name="budget"
                type="number"
                className="eo-input"
                placeholder="e.g. 5000"
                min="101"
                value={formData.budget}
                onChange={handleChange}
              />
              {validationErr.budget && (
                <span style={{ fontSize: "0.8rem", color: "#ef4444" }}>
                  {validationErr.budget}
                </span>
              )}
            </div>
          </div>

          {/* Food Preference */}
          <div className="eo-field">
            <span className="eo-label">Food Preference</span>
            <div className="eo-radio-group">
              {["Veg", "Non Veg", "Mixed"].map((pref) => (
                <label
                  key={pref}
                  className={`eo-radio-label ${formData.foodPreference === pref ? "eo-radio-active" : ""}`}
                >
                  <input
                    type="radio"
                    name="foodPreference"
                    value={pref}
                    checked={formData.foodPreference === pref}
                    onChange={handleChange}
                    className="eo-radio-input"
                  />
                  <span className="eo-radio-dot"></span>
                  {pref}
                </label>
              ))}
            </div>
            {validationErr.foodPreference && (
              <span style={{ fontSize: "0.8rem", color: "#ef4444" }}>
                {validationErr.foodPreference}
              </span>
            )}
          </div>

          {/* Meal Type + Spice Level */}
          <div className="eo-row-2">
            <div className="eo-field">
              <label className="eo-label" htmlFor="mealType">Meal Type</label>
              <div className="eo-select-wrap">
                <select
                  id="mealType"
                  name="mealType"
                  className="eo-select"
                  value={formData.mealType}
                  onChange={handleChange}
                >
                  <option value="" disabled>Select meal type</option>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snacks">Snacks</option>
                </select>
              </div>
              {validationErr.mealType && (
                <span style={{ fontSize: "0.8rem", color: "#ef4444" }}>
                  {validationErr.mealType}
                </span>
              )}
            </div>

            <div className="eo-field">
              <label className="eo-label" htmlFor="spiceLevel">Spice Level</label>
              <div className="eo-select-wrap">
                <select
                  id="spiceLevel"
                  name="spiceLevel"
                  className="eo-select"
                  value={formData.spiceLevel}
                  onChange={handleChange}
                >
                  <option value="" disabled>Select spice level</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
          </div>

          {/* Special Requirement */}
          <div className="eo-field">
            <label className="eo-label" htmlFor="specialRequirement">
              Special Requirement
              <span className="eo-label-optional">(optional)</span>
            </label>
            <textarea
              id="specialRequirement"
              name="specialRequirement"
              className="eo-textarea"
              rows={3}
              placeholder="e.g. Kids Friendly, Healthy Food, Jain Food, High Protein…"
              value={formData.specialRequirement}
              onChange={handleChange}
            />
          </div>

          {/* Submit — Feature 5: spinner text / Feature 6: disabled while loading */}
          <button type="submit" className="eo-btn" disabled={loading}>
            <span className="eo-btn-icon">{loading ? "⏳" : "✨"}</span>
            {loading ? "Generating..." : "Generate AI Menu"}
          </button>

        </form>
      </div>

      {/* ── Recommendation result card ────────────────────────────────────── */}
      {recommendation && (
        <div className="eo-card" style={{ marginTop: "32px" }}>

          {/* Title */}
          <h2 className="eo-header-title" style={{ fontSize: "1.5rem", marginBottom: "4px" }}>
            🎉 AI Recommended Menu
          </h2>
          <p className="eo-header-subtitle" style={{ marginBottom: "24px" }}>
            {recommendation.reason}
          </p>

          {/* Budget summary */}
          <div className="eo-row-2" style={{ marginBottom: "28px", gap: "12px" }}>
            <div className="eo-field" style={{ background: "#f8fafc", borderRadius: "10px", padding: "14px 18px" }}>
              <span className="eo-label">💰 Budget Per Person</span>
              <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a" }}>
                ₹{recommendation.budgetPerPerson}
              </span>
            </div>
            <div className="eo-field" style={{ background: "#f8fafc", borderRadius: "10px", padding: "14px 18px" }}>
              <span className="eo-label">🛒 Total Cost</span>
              <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a" }}>
                ₹{recommendation.totalCost}
              </span>
            </div>
            <div className="eo-field" style={{ background: "#f0fdf4", borderRadius: "10px", padding: "14px 18px" }}>
              <span className="eo-label">✅ Remaining Budget</span>
              <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "#16a34a" }}>
                ₹{recommendation.remainingBudget}
              </span>
            </div>
          </div>

          {/* Empty menu state */}
          {!groupedSections ? (
            <p className="eo-header-subtitle" style={{ color: "#ef4444", fontWeight: 600 }}>
              No suitable menu found for this budget.
            </p>
          ) : (
            <>
              {/* Sections */}
              {Object.entries(groupedSections).map(([section, items]) => (
                <div key={section} style={{ marginBottom: "28px" }}>
                  <h3 style={{
                    fontSize: "1rem", fontWeight: 700, color: "#334155",
                    marginBottom: "12px", paddingBottom: "8px",
                    borderBottom: "1.5px solid #e2e8f0",
                  }}>
                    {SECTION_EMOJI[section] || "🍽️"} {section}
                  </h3>

                  <div className="recommended-menu-grid">
                    {items.map((item, idx) => (
                      <div
                        key={item._id || idx}
                        className="recommended-menu-card"
                        style={{ position: "relative" }}
                      >
                        <span style={{
                          position: "absolute", top: "10px", right: "10px",
                          fontSize: "0.7rem", fontWeight: 600,
                          background: "#e0f2fe", color: "#0369a1",
                          padding: "2px 8px", borderRadius: "20px",
                        }}>
                          {item.category}
                        </span>
                        <p className="recommended-menu-name" style={{ paddingRight: "60px" }}>
                          {item.name}
                        </p>
                        <p style={{ fontSize: "0.82rem", color: "#64748b", margin: "4px 0 0" }}>
                          Qty: <strong>{item.quantity}</strong>
                          &nbsp;·&nbsp;₹{item.price} each
                        </p>
                        <p className="recommended-menu-price" style={{ marginTop: "8px" }}>
                          ₹{item.lineCost} total
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Budget totals footer */}
              <div style={{
                marginTop: "8px", padding: "18px 20px",
                background: "#f8fafc", borderRadius: "12px",
                border: "1.5px solid #e2e8f0",
                display: "flex", flexDirection: "column", gap: "8px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "#475569" }}>
                  <span>Total Budget</span>
                  <strong>₹{event?.budget ?? formData.budget}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "#475569" }}>
                  <span>Spent</span>
                  <strong>₹{recommendation.totalCost}</strong>
                </div>
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  fontSize: "0.9rem", paddingTop: "8px",
                  borderTop: "1px solid #e2e8f0",
                  color: "#16a34a", fontWeight: 700,
                }}>
                  <span>Remaining</span>
                  <span>₹{recommendation.remainingBudget}</span>
                </div>
              </div>

              {/* Savings message */}
              {recommendation.remainingBudget > 0 && (
                <p style={{
                  marginTop: "16px", textAlign: "center",
                  fontSize: "0.95rem", fontWeight: 700, color: "#16a34a",
                  background: "#f0fdf4", border: "1.5px solid #bbf7d0",
                  borderRadius: "10px", padding: "12px",
                }}>
                  🎉 ₹{recommendation.remainingBudget} saved within your budget!
                </p>
              )}

              {/* ── Action buttons ───────────────────────────────────────── */}
              <div style={{
                marginTop: "24px", display: "flex",
                gap: "12px", flexWrap: "wrap",
              }}>
                {/* Feature 1 & 2 — Add to cart + success toast */}
                {!cartAdded ? (
                  <button
                    type="button"
                    className="eo-btn"
                    style={{ flex: 1, minWidth: "180px" }}
                    onClick={handleAddToCart}
                    disabled={loading}
                  >
                    🛒 Add Entire Menu to Cart
                  </button>
                ) : (
                  /* Feature 3 — View Cart button after adding */
                  <button
                    type="button"
                    className="eo-btn"
                    style={{ flex: 1, minWidth: "180px", background: "linear-gradient(135deg,#0ea5e9,#2563eb)" }}
                    onClick={() => navigate("/cart")}
                  >
                    👀 View Cart
                  </button>
                )}

                {/* Feature 4 — Generate Again using same form values */}
                <button
                  type="button"
                  className="eo-btn"
                  style={{
                    flex: 1, minWidth: "180px",
                    background: "linear-gradient(135deg,#f59e0b,#d97706)",
                    boxShadow: "0 4px 14px rgba(245,158,11,0.35)",
                  }}
                  onClick={handleGenerateAgain}
                  disabled={loading}
                >
                  {loading ? "⏳ Generating..." : "🔄 Generate Again"}
                </button>
              </div>
            </>
          )}

        </div>
      )}

    </div>
  );
};

export default EventOrdering;
