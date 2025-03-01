import { Health } from "../models/health.model.js";

export const updateHealthData = async (req, res) => {
  const { bodyWeight, height } = req.body;
  const userId = req.user.id;

  try {
    if (!bodyWeight || !height) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // BMI Calculation
    const heightInMeters = height / 100;
    const bmi = (bodyWeight / (heightInMeters * heightInMeters)).toFixed(2);

    // Basic Calorie & Protein Requirement (Example Formula)
    const dailyCalories = Math.round(28 * bodyWeight);
    const dailyProtein = Math.round(1.4 * bodyWeight);

    // Check if user already has health data
    let healthData = await Health.findOne({ userId });

    if (healthData) {
      healthData.bodyWeight = bodyWeight;
      healthData.height = height;
      healthData.bmi = bmi;
      healthData.dailyCalories = dailyCalories;
      healthData.dailyProtein = dailyProtein;
      await healthData.save();
    } else {
      healthData = new Health({
        userId,
        bodyWeight,
        height,
        bmi,
        dailyCalories,
        dailyProtein,
      });
      await healthData.save();
    }

    res.status(200).json({
      success: true,
      message: "Health data updated successfully",
      healthData,
    });
  } catch (error) {
    console.error("Error updating health data:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const getHealthData = async (req, res) => {
    const userId = req.user.id; // Assuming req.user.id is set by authentication middleware
  
    try {
      // Find health data for the authenticated user
      const healthData = await Health.findOne({ userId });
  
      if (!healthData) {
        return res.status(404).json({
          success: false,
          message: "No health data found for this user",
        });
      }
  
      // Return the health data
      res.status(200).json({
        success: true,
        message: "Health data retrieved successfully",
        healthData,
      });
    } catch (error) {
      console.error("Error fetching health data:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  };