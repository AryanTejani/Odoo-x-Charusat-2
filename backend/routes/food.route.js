import express from "express";
import { detectFood, getFoodHistory } from "../controllers/food.controller.js";
import multer from "multer";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();
const upload = multer(); // Use multer for in-memory file uploads

// Food Detection Route
router.post("/detect", verifyToken,upload.single("image"), detectFood);

// Get Food History Route
router.get("/history", verifyToken,getFoodHistory);

export default router;
