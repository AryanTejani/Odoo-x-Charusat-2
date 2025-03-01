import express from "express";
import { getHealthData, updateHealthData } from "../controllers/health.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/update-health", verifyToken, updateHealthData);
router.get("/gethealth",verifyToken,getHealthData);
export default router;
