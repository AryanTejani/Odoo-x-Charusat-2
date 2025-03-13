import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { addWorkout, getUserDashboard, getWorkoutsByDate } from "../controllers/workout.controller.js";

const router = express.Router();


router.get("/dashboard", verifyToken, getUserDashboard);
router.get("/workout", verifyToken, getWorkoutsByDate);
router.post("/addWorkout", verifyToken, addWorkout);

export default router;