import foodModel from "../models/foodModel.js";
import fs from "fs";

// add food item
const addFood = async (req, res) => {
  // Guard: multer fileFilter may reject the file or no file was sent
  if (!req.file) {
    return res.json({ success: false, message: "Image file is required. Only JPG, PNG, and WebP are allowed (max 5MB)." });
  }

  const image_filename = req.file.filename;

  try {
    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: image_filename,
    });
    await food.save();
    res.json({ success: true, message: "Food Added" });
  } catch (error) {
    // DB save failed — delete the already-uploaded file to avoid orphans
    fs.unlink(`uploads/${image_filename}`, (err) => {
      if (err) console.warn(`Failed to clean up orphaned image: ${err.message}`);
    });
    console.error(error);
    res.json({ success: false, message: "Error saving food item" });
  }
};

// all food list
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// remove food item
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    if (!food) {
      return res.json({ success: false, message: "Food not found" });
    }

    fs.unlink(`uploads/${food.image}`, (err) => {
      if (err) {
        console.warn(`Failed to delete image file: ${err.message}`);
      }
    });

    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food Removed" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

export { addFood, listFood, removeFood };
