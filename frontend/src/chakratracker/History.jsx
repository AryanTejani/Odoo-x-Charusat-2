import { useEffect, useState } from "react";
import { fetchHistory } from "../utils/fetchApi.js";

const History = () => {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await fetchHistory();
        const groupedHistory = processHistory(data.data || []);
        setHistory(groupedHistory);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch history", error);
        setError("Failed to load history. Please try again.");
      }
    };

    loadHistory();
  }, []);

  // 📌 Process & group history by date, summing nutrition values
  const processHistory = (historyData) => {
    const historyMap = {};

    historyData.forEach((entry) => {
      const dateObj = new Date(entry.createdAt);
      const dateKey = dateObj.toLocaleDateString();
      const dayName = dateObj.toLocaleDateString(undefined, { weekday: "long" });
      const formattedDate = `${dayName}, ${dateObj.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}`;

      if (!historyMap[dateKey]) {
        historyMap[dateKey] = {
          date: formattedDate,
          foodItems: new Map(),
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFat: 0,
          totalSugar: 0,
          totalCholesterol: 0,
        };
      }

      entry.foodItems.forEach((food) => {
        const foodName = food.food;
        const foodNutrition = {
          calories: food.nutrition?.Calories || 0,
          protein: food.nutrition?.Protein || 0,
          carbs: food.nutrition?.Carbohydrates || 0,
          fat: food.nutrition?.Fat || 0,
          sugar: food.nutrition?.Sugar || 0,
          cholesterol: food.nutrition?.Cholesterol || 0,
          count: 1,
        };

        if (historyMap[dateKey].foodItems.has(foodName)) {
          const existing = historyMap[dateKey].foodItems.get(foodName);
          existing.count += 1;
          existing.calories += foodNutrition.calories;
          existing.protein += foodNutrition.protein;
          existing.carbs += foodNutrition.carbs;
          existing.fat += foodNutrition.fat;
          existing.sugar += foodNutrition.sugar;
          existing.cholesterol += foodNutrition.cholesterol;
        } else {
          historyMap[dateKey].foodItems.set(foodName, foodNutrition);
        }

        historyMap[dateKey].totalCalories += foodNutrition.calories;
        historyMap[dateKey].totalProtein += foodNutrition.protein;
        historyMap[dateKey].totalCarbs += foodNutrition.carbs;
        historyMap[dateKey].totalFat += foodNutrition.fat;
        historyMap[dateKey].totalSugar += foodNutrition.sugar;
        historyMap[dateKey].totalCholesterol += foodNutrition.cholesterol;
      });
    });

    return Object.values(historyMap)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 7);
  };

  return (
    <div className="mt-4 p-4 bg-gray-900 shadow-lg rounded-lg max-w-sm">
      <h2 className="text-xl font-bold mb-3 text-white text-center">Food History (Last 7 Days)</h2>

      {error && <p className="text-red-500">{error}</p>}

      {history.length === 0 && !error ? (
        <p className="text-gray-400 text-center">No food history available.</p>
      ) : (
        <ul className="space-y-3">
          {history.map((day, index) => (
            <li key={index} className="p-3 border rounded-lg bg-gray-800 text-white shadow-md">
              <h3 className="font-semibold text-orange-400">📅 {day.date}</h3>

              <p className="font-medium mt-2">🍽️ Food Items:</p>
              <ul className="list-disc ml-5">
                {[...day.foodItems.entries()].map(([foodName, details], i) => (
                  <li key={i}>
                    {foodName} {details.count > 1 ? `(${details.count} times)` : ""}
                    <ul className="ml-4 text-sm text-gray-300">
                      <li>🔥 Calories: {details.calories} kcal</li>
                      <li>💪 Protein: {details.protein} g</li>
                      <li>🍞 Carbs: {details.carbs} g</li>
                      <li>🛢 Fat: {details.fat} g</li>
                      <li>🍬 Sugar: {details.sugar} g</li>
                      <li>🩸 Cholesterol: {details.cholesterol} mg</li>
                    </ul>
                  </li>
                ))}
              </ul>

              <p className="font-semibold mt-3 text-orange-300">📊 Daily Total:</p>
              <p>🔥 Calories: {day.totalCalories} kcal</p>
              <p>💪 Protein: {day.totalProtein} g</p>
              <p>🍞 Carbs: {day.totalCarbs} g</p>
              <p>🛢 Fat: {day.totalFat} g</p>
              <p>🍬 Sugar: {day.totalSugar} g</p>
              <p>🩸 Cholesterol: {day.totalCholesterol} mg</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default History;
