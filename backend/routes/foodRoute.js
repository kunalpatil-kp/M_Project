import express from "express";
import { addFood,listFood,removeFood} from "../controllers/foodController.js";
import multer from "multer";
import adminAuthMiddleware from "../middleware/adminAuth.js";

import validateObjectId from "../middleware/validateObjectId.js";

const foodRouter = express.Router();
// Image storage engine

const storage = multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{
     return cb(null,`${Date.now()}_${file.originalname.replace(/\\s+/g, "_")}`)
    }
})

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPG, PNG, and WebP are allowed."), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
})

foodRouter.post("/add",adminAuthMiddleware,upload.single("image"),addFood)
foodRouter.get("/list",listFood)
foodRouter.post("/remove",adminAuthMiddleware,validateObjectId("id"),removeFood);

export default foodRouter;