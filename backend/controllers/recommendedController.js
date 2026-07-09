import userModel from "../models/userModel.js";
import orderModel from "../models/ordermodel.js";
import budgetModel from "../models/budgetModel.js";
import foodModel from "../models/foodModel.js";

// AI Smart Grocery Recommendation Engine
const getRecommendations = async (req, res) => {
  try {
    const userId = req.body.userId; // Provided by auth middleware

    // Fetch required data
    const user = await userModel.findById(userId);
    const orders = await orderModel.find({ userId });
    const budget = await budgetModel.findOne({ userId });
    const allFoods = await foodModel.find({});

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const cartData = user.cartData || {};
    const cartProductIds = Object.keys(cartData).filter(id => cartData[id] > 0);

    // Rule 3: Filter out items already in cart
    let availableFoods = allFoods.filter(
      (food) => !cartProductIds.includes(food._id.toString())
    );

    let recommendations = [];
    const recommendedIds = new Set(); // Rule 6: Avoid duplicates

    // Helper to add recommendation
    const addRecommendation = (food, reason) => {
      if (!recommendedIds.has(food._id.toString()) && recommendations.length < 12) {
        recommendations.push({ ...food.toObject(), reason });
        recommendedIds.add(food._id.toString());
      }
    };

    // Determine frequent categories from order history (Rule 2)
    let frequentCategories = [];
    if (orders && orders.length > 0) {
      const categoryCounts = {};
      orders.forEach((order) => {
        if (order.items) {
          order.items.forEach((item) => {
            categoryCounts[item.category] = (categoryCounts[item.category] || 0) + item.quantity;
          });
        }
      });
      frequentCategories = Object.entries(categoryCounts)
        .sort((a, b) => b[1] - a[1])
        .map((entry) => entry[0]);
    }

    const remainingBudget = budget ? budget.remainingBudget : null;

    // Rule 4: Affordable
    if (remainingBudget !== null && remainingBudget < 1000) {
      const affordableFoods = availableFoods.filter(f => f.price <= 200);
      affordableFoods.forEach(f => addRecommendation(f, "Fits your remaining budget"));
    }

    // Rule 5: Premium
    if (remainingBudget !== null && remainingBudget > 5000) {
      const premiumFoods = availableFoods.filter(f => f.price >= 500);
      premiumFoods.forEach(f => addRecommendation(f, "Premium choice for you"));
    }

    // Rule 2: Frequent Categories
    if (frequentCategories.length > 0) {
      frequentCategories.forEach((cat) => {
        const catFoods = availableFoods.filter(f => f.category === cat);
        catFoods.forEach(f => addRecommendation(f, "Matches your shopping habits"));
      });
    }

    // Rule 1 & Fallback: Popular products (shuffled so it's not the same for every user)
    if (recommendations.length < 12) {
      const shuffledFoods = [...availableFoods].sort(() => 0.5 - Math.random());
      shuffledFoods.forEach(f => addRecommendation(f, "Popular among similar users"));
    }

    // We generate up to 12 so frontend can filter out cart additions locally and still have 6
    res.json({
      success: true,
      recommendations: recommendations
    });

  } catch (error) {
    console.log(error);
    res.json({ 
      success: false, 
      message: "Error fetching recommendations", 
      recommendations: [] 
    });
  }
};

export { getRecommendations };
