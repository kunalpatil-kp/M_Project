// services/eventRecommendationService.js
// AI Event Ordering — custom recommendation engine (no external AI API).
// Only this file is modified. No other file is touched.

import foodModel from "../models/foodModel.js";

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY MAPS
//
// foodModel.category is the only classification field available.
// We use these lookup tables to:
//   1. Determine whether a food item is vegetarian or non-vegetarian.
//   2. Assign each item to a menu section (Starter / Main Course / Dessert / Drink).
//
// Any category NOT listed here is treated as:
//   • Veg by default (safer assumption for unknown categories)
//   • Section: "Other" (gracefully included at the end)
// ─────────────────────────────────────────────────────────────────────────────

// Categories that are purely vegetarian.
const VEG_CATEGORIES = new Set([
  "salad",
  "pure veg",
  "deserts",
  "cake",
  "pasta",
  "noodles",
  "sandwich",
  "rolls",
]);

// Categories that are non-vegetarian (or can contain non-veg).
// Currently none of the default categories are explicitly non-veg,
// but this set is kept for extensibility.
const NON_VEG_CATEGORIES = new Set([
  // e.g. "chicken", "seafood" — add when new categories are introduced
]);

// Map each category to a menu section.
const CATEGORY_TO_SECTION = {
  salad:    "Starter",
  sandwich: "Starter",
  rolls:    "Starter",
  pasta:    "Main Course",
  noodles:  "Main Course",
  "pure veg": "Main Course",
  deserts:  "Dessert",
  cake:     "Dessert",
};

// Quantity multipliers per section (relative to guestCount).
// These represent realistic per-guest serving ratios:
//   Starter     : 1 unit per 5 guests (shared platters)
//   Main Course : 1 unit per guest
//   Dessert     : 1 unit per guest
//   Drink       : 1 unit per 2 guests
//   Other       : 1 unit per 5 guests (treat like starter)
const QUANTITY_MULTIPLIER = {
  Starter:      (g) => Math.max(1, Math.ceil(g / 5)),
  "Main Course": (g) => Math.max(1, g),
  Dessert:      (g) => Math.max(1, g),
  Drink:        (g) => Math.max(1, Math.ceil(g / 2)),
  Other:        (g) => Math.max(1, Math.ceil(g / 5)),
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Normalise a category string to lowercase-trimmed for safe comparisons.
 */
const normaliseCategory = (cat) => (cat || "").toLowerCase().trim();

/**
 * Decide if an item is vegetarian based on its category.
 * Returns true  → item is vegetarian.
 * Returns false → item is non-vegetarian.
 * Unknown categories default to true (veg-safe assumption).
 */
const isVeg = (item) => {
  const cat = normaliseCategory(item.category);
  if (NON_VEG_CATEGORIES.has(cat)) return false;
  // Everything else (including VEG_CATEGORIES and unknowns) is treated as veg.
  return true;
};

/**
 * Map a food item's category to one of the four menu sections.
 * Unknown categories fall back to "Other".
 */
const getSection = (item) => {
  const cat = normaliseCategory(item.category);
  return CATEGORY_TO_SECTION[cat] || "Other";
};

/**
 * Sort an array of food items:
 *   • If a `rating` field exists on any item, sort descending by rating.
 *   • Otherwise sort ascending by price (cheapest best-value first).
 * The foodModel has no rating field, so this always falls back to price sort —
 * but the rating path is kept for forward compatibility.
 */
const sortByBestValue = (items) => {
  const hasRating = items.some((i) => i.rating != null);
  if (hasRating) {
    return [...items].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }
  return [...items].sort((a, b) => a.price - b.price);
};

/**
 * Round a number to 2 decimal places.
 */
const round2 = (n) => Math.round(n * 100) / 100;

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * generateEventMenu()
 *
 * Produces a structured, budget-aware menu for an event.
 *
 * @param {Object} params
 * @param {number} params.guestCount        - number of guests (min 1)
 * @param {number} params.budget            - total budget in ₹ (min 100)
 * @param {string} params.foodPreference    - "Veg" | "Non Veg" | "Mixed"
 * @param {string} params.mealType          - "Breakfast"|"Lunch"|"Dinner"|"Snacks"
 * @param {string} params.eventType         - e.g. "Birthday", "Wedding"
 * @param {string} params.specialRequirement - free-text note (can be "")
 *
 * @returns {Promise<{
 *   generatedMenu: Array,
 *   totalCost: number,
 *   remainingBudget: number,
 *   budgetPerPerson: number,
 *   reason: string
 * }>}
 */
const generateEventMenu = async ({
  guestCount,
  budget,
  foodPreference = "Mixed",
  mealType = "Lunch",
  eventType = "",
  specialRequirement = "",
}) => {

  // ── Safe defaults ────────────────────────────────────────────────────────
  const safeGuestCount = Math.max(1, Number(guestCount) || 1);
  const safeBudget     = Math.max(100, Number(budget) || 100);

  // ── Empty result shape — returned on any unrecoverable edge case ─────────
  const emptyResult = (reason) => ({
    generatedMenu:   [],
    totalCost:       0,
    remainingBudget: safeBudget,
    budgetPerPerson: round2(safeBudget / safeGuestCount),
    reason,
  });

  try {

    // ── STEP 1: Fetch all food items from the database ───────────────────
    const allFoods = await foodModel.find({}).lean();

    if (!allFoods || allFoods.length === 0) {
      return emptyResult("No food items found in the database.");
    }

    // ── STEP 2: Filter by food preference ───────────────────────────────
    // "Veg"     → keep only vegetarian items
    // "Non Veg" → keep only non-vegetarian items
    // "Mixed"   → keep everything
    let filtered = allFoods;

    if (foodPreference === "Veg") {
      filtered = allFoods.filter((item) => isVeg(item));
    } else if (foodPreference === "Non Veg") {
      filtered = allFoods.filter((item) => !isVeg(item));
    }
    // "Mixed" → no filtering needed

    if (filtered.length === 0) {
      return emptyResult(
        `No ${foodPreference} food items found. Try "Mixed" preference.`
      );
    }

    // ── STEP 3: Budget per person ────────────────────────────────────────
    const budgetPerPerson = round2(safeBudget / safeGuestCount);

    // ── STEP 4: Split into menu sections ────────────────────────────────
    // Group items by their resolved section name.
    const sections = {};
    filtered.forEach((item) => {
      const sec = getSection(item);
      if (!sections[sec]) sections[sec] = [];
      sections[sec].push(item);
    });

    // Determine which sections to include based on mealType.
    // Breakfast → Starter + Dessert
    // Snacks    → Starter + Other
    // Lunch/Dinner → all sections
    let sectionOrder;
    if (mealType === "Breakfast") {
      sectionOrder = ["Starter", "Dessert", "Drink"];
    } else if (mealType === "Snacks") {
      sectionOrder = ["Starter", "Other", "Drink"];
    } else {
      // Lunch / Dinner
      sectionOrder = ["Starter", "Main Course", "Dessert", "Drink", "Other"];
    }

    // ── STEP 5: Sort each section — best-rated first, else cheapest first ─
    Object.keys(sections).forEach((sec) => {
      sections[sec] = sortByBestValue(sections[sec]);
    });

    // ── STEP 6 & 7: Build menu within budget ────────────────────────────
    // For each section, pick the top item (best value) and calculate
    // the cost for the required quantity. If it exceeds the remaining
    // budget, try the next cheapest item in that section. Skip the
    // section entirely if no item fits.

    const generatedMenu = [];
    let totalCost = 0;
    let remainingBudget = safeBudget;

    for (const sec of sectionOrder) {
      // Gracefully skip sections with no items
      if (!sections[sec] || sections[sec].length === 0) continue;

      // Quantity for this section based on guest count
      const getQty = QUANTITY_MULTIPLIER[sec] || QUANTITY_MULTIPLIER["Other"];
      const quantity = getQty(safeGuestCount);

      // Try each item in this section (best value first)
      // until one fits in the remaining budget
      let chosen = null;

      for (const candidate of sections[sec]) {
        const lineCost = round2(candidate.price * quantity);

        if (lineCost <= remainingBudget) {
          chosen = { ...candidate, quantity, lineCost, section: sec };
          break; // first (best-value) item that fits
        }

        // Item too expensive even alone — try to reduce quantity
        // to at least 1 and see if a single unit fits
        const singleCost = round2(candidate.price * 1);
        if (singleCost <= remainingBudget) {
          const affordableQty = Math.floor(remainingBudget / candidate.price);
          if (affordableQty >= 1) {
            chosen = {
              ...candidate,
              quantity: affordableQty,
              lineCost: round2(candidate.price * affordableQty),
              section: sec,
            };
            break;
          }
        }
      }

      if (chosen) {
        generatedMenu.push({
          _id:         chosen._id,
          name:        chosen.name,
          category:    chosen.category,
          price:       chosen.price,
          image:       chosen.image,
          section:     chosen.section,
          quantity:    chosen.quantity,
          lineCost:    chosen.lineCost,
        });

        totalCost       = round2(totalCost + chosen.lineCost);
        remainingBudget = round2(remainingBudget - chosen.lineCost);
      }
      // If no item in this section fits the budget at all, we skip it
    }

    // ── STEP 8: Build the reason string ─────────────────────────────────
    const sectionsCovered = [...new Set(generatedMenu.map((i) => i.section))];

    let reason;
    if (generatedMenu.length === 0) {
      reason = `Budget of ₹${safeBudget} is too low for any item with ${safeGuestCount} guests.`;
    } else {
      reason =
        `${foodPreference} ${mealType} menu generated for ${safeGuestCount} guest` +
        `${safeGuestCount !== 1 ? "s" : ""}` +
        ` (${eventType || "Event"}).` +
        ` Covers: ${sectionsCovered.join(", ")}.` +
        ` Total: ₹${totalCost} of ₹${safeBudget} budget.`;
    }

    return {
      generatedMenu,
      totalCost,
      remainingBudget,
      budgetPerPerson,
      reason,
    };

  } catch (error) {
    // Never let an uncaught error propagate — return a safe empty result
    console.error("[eventRecommendationService] generateEventMenu error:", error.message);
    return emptyResult("An error occurred while generating the menu. Please try again.");
  }
};

export { generateEventMenu };
