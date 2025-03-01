import { UserHistory } from "../models/food.model.js";
import axios from "axios";
import FormData from "form-data";
import stream from "stream";

export const detectFood = async (req, res) => {
  try {
    console.log("🚀 detectFood called");

    if (!req.file) {
      console.error("❌ No image uploaded");
      return res.status(400).json({ error: "No image uploaded" });
    }

    console.log("📤 Sending image to Flask API...");
    const flaskApiUrl = "http://127.0.0.1:3000/api/tracker/detect-food";

    // Convert buffer to a readable stream
    const bufferStream = new stream.PassThrough();
    bufferStream.end(req.file.buffer);

    const formData = new FormData();
    formData.append("image", bufferStream, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    // Send image to Flask API
    const response = await axios.post(flaskApiUrl, formData, {
      headers: { ...formData.getHeaders() },
    });

    const detectedFoods = response.data.data;
    console.log("🔍 Detected Foods:", detectedFoods);

    if (!detectedFoods || detectedFoods.length === 0) {
      console.warn("⚠️ No food detected");
      return res.status(400).json({ error: "No food detected" });
    }

    const userId = req.user.id;
    console.log("🛂 User ID:", userId);

    // Format detected food entries with current timestamp
    const currentTime = new Date();
    const foodEntries = detectedFoods.map((item) => ({
      food: item.food,
      nutrition: {
        Calories: item.nutrition["Calories (kcal)"] || 0,
        Carbohydrates: item.nutrition["Carbohydrates (g)"] || 0,
        Cholesterol: item.nutrition["Cholesterol (mg)"] || 0,
        Fat: item.nutrition["Fat (g)"] || 0,
        Protein: item.nutrition["Protein (g)"] || 0,
        Sugar: item.nutrition["Sugar (g)"] || 0,
        FoodItem: item.nutrition["Food Item"] || item.food,
      },
      createdAt: currentTime // Set today's date/time
    }));

    // Find or create user history document
    let userHistory = await UserHistory.findOne({ userId });

    if (userHistory) {
      console.log("📝 Updating existing user history...");
      userHistory.foodItems.push(...foodEntries);
    } else {
      console.log("🆕 Creating new user history...");
      userHistory = new UserHistory({
        userId,
        foodItems: foodEntries,
      });
    }

    await userHistory.save();
    console.log("✅ Food detected & saved successfully!");

    res.json({ message: "Food detected and saved", data: foodEntries });
  } catch (error) {
    console.error("❌ Error in detectFood:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getFoodHistory = async (req, res) => {
  try {
    console.log("🔍 getFoodHistory called");
    console.log("🛂 User in request:", req.user);

    if (!req.user || !req.user.id) {
      console.log("❌ Unauthorized access - No user ID found");
      return res.status(401).json({ error: "Unauthorized - No user ID found" });
    }

    const userId = req.user.id;
    console.log("✅ Fetching history for user ID:", userId);

    // Get all user history entries
    const history = await UserHistory.find({ userId }).sort({ createdAt: -1 });
    console.log("📜 Retrieved food history documents:", history.length);

    res.json({ data: history });
  } catch (error) {
    console.error("❌ Error in getFoodHistory:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};