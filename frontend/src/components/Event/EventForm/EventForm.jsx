// components/Event/EventForm/EventForm.jsx
// AI Event Ordering — boilerplate only, no business logic yet.

import React, { useState } from "react";
import "./EventForm.css";

const EventForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    eventName: "",
    eventType: "",
    guestCount: "",
    eventDate: "",
    budget: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(formData);
  };

  return (
    <form className="event-form" onSubmit={handleSubmit}>
      <h2 className="event-form-title">Event Details</h2>

      <div className="event-form-group">
        <label>Event Name</label>
        <input
          type="text"
          name="eventName"
          placeholder="e.g. Birthday Party"
          value={formData.eventName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="event-form-group">
        <label>Event Type</label>
        <select name="eventType" value={formData.eventType} onChange={handleChange} required>
          <option value="">Select type</option>
          <option value="Birthday">Birthday</option>
          <option value="Wedding">Wedding</option>
          <option value="Corporate">Corporate</option>
          <option value="Anniversary">Anniversary</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="event-form-row">
        <div className="event-form-group">
          <label>Guest Count</label>
          <input
            type="number"
            name="guestCount"
            placeholder="e.g. 50"
            min="1"
            value={formData.guestCount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="event-form-group">
          <label>Budget (₹)</label>
          <input
            type="number"
            name="budget"
            placeholder="e.g. 5000"
            min="0"
            value={formData.budget}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="event-form-group">
        <label>Event Date</label>
        <input
          type="date"
          name="eventDate"
          value={formData.eventDate}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className="event-form-btn">
        ✨ Get AI Menu Recommendations
      </button>
    </form>
  );
};

export default EventForm;
