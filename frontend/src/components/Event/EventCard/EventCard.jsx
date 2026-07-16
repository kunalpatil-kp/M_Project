// components/Event/EventCard/EventCard.jsx
// AI Event Ordering — boilerplate only, no business logic yet.

import React from "react";
import "./EventCard.css";

/**
 * EventCard — displays a summary of a single saved event.
 * Props:
 *   event: { eventName, eventType, guestCount, eventDate, budget, status }
 */
const EventCard = ({ event = {} }) => {
  return (
    <div className="event-card">
      <h3 className="event-card-name">{event.eventName || "Unnamed Event"}</h3>
      <p className="event-card-type">{event.eventType || "—"}</p>
      <div className="event-card-meta">
        <span>👥 {event.guestCount ?? "—"} guests</span>
        <span>💰 ₹{event.budget ?? "—"}</span>
        <span>📅 {event.eventDate ? new Date(event.eventDate).toLocaleDateString("en-IN") : "—"}</span>
      </div>
      <span className={`event-card-status ${event.status || "pending"}`}>
        {event.status || "pending"}
      </span>
    </div>
  );
};

export default EventCard;
