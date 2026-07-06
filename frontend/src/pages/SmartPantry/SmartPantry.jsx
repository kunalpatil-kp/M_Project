import React, { useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SmartPantry.css";
import { StoreContext } from "../../context/StoreContext";

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const getProgressWidth = (remainingDays, estimatedDays) => {
  if (remainingDays <= 0) return 0;
  const pct = (remainingDays / estimatedDays) * 100;
  return Math.min(Math.max(pct, 4), 100); // at least 4% visible
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const SmartPantry = () => {
  const { url, token, addToCart } = useContext(StoreContext);
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  // ── Redirect if not logged in ──────────────────────────────
  useEffect(() => {
    if (!token) navigate("/");
  }, [token, navigate]);

  // ── Fetch pantry ───────────────────────────────────────────
  const fetchPantry = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${url}/api/pantry`, { headers: { token } });
      if (res.data.success) {
        setItems(res.data.items || []);
        setNotifications(res.data.notifications || []);
      }
    } catch (err) {
      console.error("Error fetching pantry:", err);
    } finally {
      setLoading(false);
    }
  }, [token, url]);

  useEffect(() => { fetchPantry(); }, [fetchPantry]);

  // ── Reorder: add item to cart & navigate ───────────────────
  const handleReorder = (foodId) => {
    addToCart(foodId.toString());
    navigate("/cart");
  };

  // ── Remove from pantry ─────────────────────────────────────
  const handleRemove = async (itemId) => {
    setRemovingId(itemId);
    try {
      const res = await axios.post(
        `${url}/api/pantry/remove`,
        { itemId },
        { headers: { token } }
      );
      if (res.data.success) {
        setItems((prev) => prev.filter((i) => i._id !== itemId));
        setNotifications((prev) =>
          prev.filter((_, idx) => items.findIndex((i) => i._id === itemId) !== idx)
        );
      }
    } catch (err) {
      console.error("Error removing pantry item:", err);
    } finally {
      setRemovingId(null);
    }
  };

  // ── Stats ──────────────────────────────────────────────────
  const stats = {
    green:  items.filter((i) => i.statusColor === "green").length,
    yellow: items.filter((i) => i.statusColor === "yellow").length,
    orange: items.filter((i) => i.statusColor === "orange").length,
    red:    items.filter((i) => i.statusColor === "red").length,
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="pantry-page">
        <div className="pantry-loading">
          <div className="pantry-spinner"></div>
          <p>Loading your pantry...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="pantry-page">
        <div className="pantry-header">
          <h1 className="pantry-title">🏡 My Smart Pantry</h1>
          <p className="pantry-subtitle">Your virtual grocery storage, powered by AI</p>
        </div>
        <div className="pantry-empty">
          <div className="pantry-empty-icon">🧺</div>
          <h3>Your pantry is empty</h3>
          <p>Complete an order and your groceries will appear here automatically.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pantry-page">
      {/* ── PAGE HEADER ──────────────────────────────────────── */}
      <div className="pantry-header">
        <h1 className="pantry-title">🏡 My Smart Pantry</h1>
        <p className="pantry-subtitle">
          {items.length} item{items.length !== 1 ? "s" : ""} tracked • AI-powered expiry monitoring
        </p>
      </div>

      {/* ── AI NOTIFICATIONS ─────────────────────────────────── */}
      {notifications.length > 0 && (
        <div className="pantry-notifications">
          <h3>🤖 AI Pantry Alerts</h3>
          <ul>
            {notifications.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ── STATS ROW ────────────────────────────────────────── */}
      <div className="pantry-stats">
        <div className="stat-card green">
          <div className="stat-number">{stats.green}</div>
          <div className="stat-label">🟢 Fresh</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-number">{stats.yellow}</div>
          <div className="stat-label">🟡 Use Soon</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-number">{stats.orange}</div>
          <div className="stat-label">🟠 Low Stock</div>
        </div>
        <div className="stat-card red">
          <div className="stat-number">{stats.red}</div>
          <div className="stat-label">🔴 Reorder Now</div>
        </div>
      </div>

      {/* ── PANTRY GRID ──────────────────────────────────────── */}
      <div className="pantry-grid">
        {items.map((item) => {
          const progressWidth = getProgressWidth(item.remainingDays, item.estimatedDays);
          const isRemoving = removingId === item._id;

          return (
            <div
              key={item._id}
              className={`pantry-card ${item.statusColor}`}
              style={{ opacity: isRemoving ? 0.5 : 1, transition: "opacity 0.3s" }}
            >
              {/* Image */}
              <div className="pantry-card-img-wrap">
                <img
                  src={`${url}/images/${item.image}`}
                  alt={item.name}
                  className="pantry-card-img"
                />
                <span className={`pantry-status-badge ${item.statusColor}`}>
                  {item.status}
                </span>
              </div>

              {/* Body */}
              <div className="pantry-card-body">
                {/* Title + Price */}
                <div className="pantry-card-title-row">
                  <h3 className="pantry-item-name">{item.name}</h3>
                  <span className="pantry-item-price">₹{item.price}</span>
                </div>
                <p className="pantry-item-category">{item.category}</p>

                {/* Meta grid */}
                <div className="pantry-meta">
                  <div className="pantry-meta-item">
                    <div className="pantry-meta-label">Quantity</div>
                    <div className="pantry-meta-value">× {item.quantity}</div>
                  </div>
                  <div className="pantry-meta-item">
                    <div className="pantry-meta-label">Purchased</div>
                    <div className="pantry-meta-value">{formatDate(item.purchaseDate)}</div>
                  </div>
                  <div className="pantry-meta-item">
                    <div className="pantry-meta-label">Est. Expiry</div>
                    <div className="pantry-meta-value">{formatDate(item.expiryDate)}</div>
                  </div>
                  <div className="pantry-meta-item">
                    <div className="pantry-meta-label">Remaining</div>
                    <div className="pantry-meta-value">
                      {item.remainingDays > 0
                        ? `${item.remainingDays} day${item.remainingDays !== 1 ? "s" : ""}`
                        : "Expired"}
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="pantry-progress-wrap">
                  <div className="pantry-progress-label">
                    <span>Freshness</span>
                    <span>{item.remainingDays > 0 ? `${Math.round(progressWidth)}%` : "0%"}</span>
                  </div>
                  <div className="pantry-progress-bar">
                    <div
                      className={`pantry-progress-fill ${item.statusColor}`}
                      style={{ width: `${progressWidth}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="pantry-card-actions">
                  {(item.statusColor === "red" || item.statusColor === "orange") && (
                    <button
                      className="btn-reorder"
                      onClick={() => handleReorder(item.foodId)}
                    >
                      🛒 Reorder Now
                    </button>
                  )}
                  <button
                    className="btn-remove"
                    onClick={() => handleRemove(item._id)}
                    disabled={isRemoving}
                  >
                    {isRemoving ? "..." : "Remove"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SmartPantry;
