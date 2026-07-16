// controllers/eventController.js
// AI Event Ordering — production controller.
// Only this file is modified. No other file is touched.

import eventModel from "../models/eventModel.js";
import { generateEventMenu } from "../services/eventRecommendationService.js";

// ─────────────────────────────────────────────────────────────────────────────
// generateEventRecommendation
//
// POST /api/event/recommend
//
// Expects authMiddleware to have already run and injected:
//   req.body.userId  ← decoded from JWT by authMiddleware
//
// Request body fields:
//   eventType          String   required
//   guestCount         Number   required  (> 0)
//   budget             Number   required  (> 0)
//   foodPreference     String   required
//   mealType           String   required
//   spiceLevel         String   optional
//   specialRequirement String   optional
//
// Returns:
//   200  { success: true, message, event, recommendation }
//   400  validation error
//   500  server / DB error
// ─────────────────────────────────────────────────────────────────────────────

const generateEventRecommendation = async (req, res) => {
  try {
    // ── Pull userId injected by authMiddleware ───────────────────────────
    const userId = req.body.userId;

    // ── Destructure request body ─────────────────────────────────────────
    const {
      eventType,
      guestCount,
      budget,
      foodPreference,
      mealType,
      spiceLevel        = "",
      specialRequirement = "",
    } = req.body;

    // ── VALIDATION ───────────────────────────────────────────────────────
    // Return 400 with a friendly message for every missing / invalid field.

    if (!eventType || typeof eventType !== "string" || !eventType.trim()) {
      return res.status(400).json({
        success: false,
        message: "Event type is required. Please select a valid event type.",
      });
    }

    const parsedGuestCount = Number(guestCount);
    if (!guestCount || isNaN(parsedGuestCount) || parsedGuestCount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Guest count must be a positive number greater than 0.",
      });
    }

    const parsedBudget = Number(budget);
    if (!budget || isNaN(parsedBudget) || parsedBudget <= 0) {
      return res.status(400).json({
        success: false,
        message: "Budget must be a positive number greater than 0.",
      });
    }

    if (!foodPreference || typeof foodPreference !== "string" || !foodPreference.trim()) {
      return res.status(400).json({
        success: false,
        message: "Food preference is required. Choose Veg, Non Veg, or Mixed.",
      });
    }

    if (!mealType || typeof mealType !== "string" || !mealType.trim()) {
      return res.status(400).json({
        success: false,
        message: "Meal type is required. Choose Breakfast, Lunch, Dinner, or Snacks.",
      });
    }

    // ── STEP 1: Call recommendation service ──────────────────────────────
    // generateEventMenu() never throws — it always returns a safe result.
    const recommendation = await generateEventMenu({
      guestCount:         parsedGuestCount,
      budget:             parsedBudget,
      foodPreference:     foodPreference.trim(),
      mealType:           mealType.trim(),
      eventType:          eventType.trim(),
      specialRequirement: specialRequirement.trim(),
    });

    // recommendation shape:
    // { generatedMenu, totalCost, remainingBudget, budgetPerPerson, reason }

    // ── STEP 2: Persist the event + generated menu to MongoDB ─────────────
    const newEvent = new eventModel({
      userId,
      eventType:          eventType.trim(),
      guestCount:         parsedGuestCount,
      budget:             parsedBudget,
      foodPreference:     foodPreference.trim(),
      mealType:           mealType.trim(),
      spiceLevel:         spiceLevel         ? spiceLevel.trim()          : undefined,
      specialRequirement: specialRequirement ? specialRequirement.trim()  : "",
      generatedMenu:      recommendation.generatedMenu,
      totalCost:          recommendation.totalCost,
      remainingBudget:    recommendation.remainingBudget,
    });

    await newEvent.save();

    // ── STEP 3: Return structured response ───────────────────────────────
    return res.status(200).json({
      success: true,
      message: "Event recommendation generated successfully.",
      event: newEvent,
      recommendation: {
        generatedMenu:   recommendation.generatedMenu,
        totalCost:       recommendation.totalCost,
        remainingBudget: recommendation.remainingBudget,
        budgetPerPerson: recommendation.budgetPerPerson,
        reason:          recommendation.reason,
      },
    });

  } catch (error) {
    // Catch any unexpected DB or runtime error — never crash the server.
    console.error("[eventController] generateEventRecommendation error:", error.message);

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while generating the event recommendation. Please try again.",
    });
  }
};

// Export ONLY the new function as specified.
// The old boilerplate stubs (createEvent, getEvents, etc.) are removed
// because they were placeholders with no logic and are not needed.
export { generateEventRecommendation };
