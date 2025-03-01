import { useEffect, useState } from "react";
import { fetchHealthdata, fetchHistory } from "../utils/fetchApi.js";
import { Link } from "react-router-dom";

const DashboardPage = () => {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [activeDay, setActiveDay] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [healthData,setHealthData] = useState(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await fetchHistory();
        const groupedHistory = processHistory(data.data || []);
        setHistory(groupedHistory);

        if (groupedHistory.length > 0) {
          setActiveDay(groupedHistory[0].dateKey);
        }

        setError(null);
      } catch (error) {
        console.error("Failed to fetch history", error);
        setError("Failed to load history. Please try again.");
      }
    };
    const loadHealthData = async () => {
      try {
        const cachedHealthData = localStorage.getItem("healthData");
        if (cachedHealthData) {
          setHealthData(JSON.parse(cachedHealthData));
        }
    
        const data = await fetchHealthdata();
        setHealthData(data);
    
        localStorage.setItem("healthData", JSON.stringify(data));
      } catch (error) {
        console.error("Failed to fetch health data", error);
      }
    };
    

    loadHistory();
    loadHealthData();
  }, [refresh]);

  // Process & group history by date, summing nutrition values
  const processHistory = (historyData) => {
    const historyMap = {};

    // Get date range for last 7 days (including today)
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today
    
    const last7Days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateKey = date.toISOString().split("T")[0];
      last7Days.push(dateKey);

      // Pre-initialize the historyMap with empty entries for all 7 days
      historyMap[dateKey] = {
        dateKey,
        date: date.toLocaleDateString(undefined, {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        shortDate: date.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        }),
        dayName: date
          .toLocaleDateString(undefined, { weekday: "long" })
          .substring(0, 3),
        foodItems: [],
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        totalSugar: 0,
        totalCholesterol: 0,
      };
    }

    // Process all history entries
    historyData.forEach((historyEntry) => {
      // Process each food item in the history entry
      historyEntry.foodItems.forEach((food) => {
        // Create a new date object from the food item's createdAt
        // and strip time components to get just the date
        const foodDate = new Date(food.createdAt);
        foodDate.setHours(0, 0, 0, 0);
        
        // Convert to YYYY-MM-DD format for consistency
        const dateKey = foodDate.toISOString().split("T")[0];
        
        // Only process if this is one of our 7 days we're showing
        if (!last7Days.includes(dateKey)) {
          return;
        }
        
        // Process the food item nutrition data
        const foodItem = {
          name: food.food,
          calories: food.nutrition?.Calories || 0,
          protein: food.nutrition?.Protein || 0,
          carbs: food.nutrition?.Carbohydrates || 0,
          fat: food.nutrition?.Fat || 0,
          sugar: food.nutrition?.Sugar || 0,
          cholesterol: food.nutrition?.Cholesterol || 0,
          // Store the full timestamp for debugging if needed
          timestamp: food.createdAt
        };

        // Add to the correct date in our history map
        historyMap[dateKey].foodItems.push(foodItem);
        historyMap[dateKey].totalCalories += foodItem.calories;
        historyMap[dateKey].totalProtein += foodItem.protein;
        historyMap[dateKey].totalCarbs += foodItem.carbs;
        historyMap[dateKey].totalFat += foodItem.fat;
        historyMap[dateKey].totalSugar += foodItem.sugar;
        historyMap[dateKey].totalCholesterol += foodItem.cholesterol;
      });
    });

    // Convert to array and sort by date (newest first)
    return Object.values(historyMap).sort(
      (a, b) => new Date(b.dateKey) - new Date(a.dateKey)
    );
  };

  // Get active day data
  const getActiveDayData = () => {
    return history.find((day) => day.dateKey === activeDay) || {
      dateKey: "",
      date: "",
      foodItems: [],
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      totalSugar: 0,
      totalCholesterol: 0,
    };
  };

  // Calculate percentage for macronutrients
  const calculatePercentage = (value, total) => {
    if (!total) return 0;
    return Math.round((value / total) * 100);
  };

  return (
    <div className="w-full bg-white min-h-screen fixed top-0 left-0 right-0 bottom-0 overflow-y-auto">
      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Nutrition Dashboard
        </h1>

        {error && (
          <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* Display User Health Data */}
        {healthData && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Health Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Daily Calories</p>
                <p className="font-bold text-gray-800">{healthData.healthData.dailyCalories} kcal</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Daily Protein</p>
                <p className="font-bold text-gray-800">{healthData.healthData.dailyProtein}g</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">BMI</p>
                <p className="font-bold text-gray-800">{healthData.healthData.bmi}</p>
              </div>
            </div>
          </div>
        )}

        {/* Date Navigation */}
        {history.length > 0 && (
          <div className="flex overflow-x-auto space-x-2 pb-4 mb-6">
            {history.map((day) => (
              <button
                key={day.dateKey}
                onClick={() => setActiveDay(day.dateKey)}
                className={`flex flex-col items-center p-3 min-w-16 rounded-lg ${
                  activeDay === day.dateKey
                    ? "bg-green-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="text-xs font-medium">{day.dayName}</span>
                <span className="text-lg font-bold">
                  {day.shortDate.split(" ")[1]}
                </span>
                <span className="text-xs">{day.shortDate.split(" ")[0]}</span>
              </button>
            ))}
          </div>
        )}

        {history.length === 0 && !error ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500">No food history available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Daily Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                  Daily Summary
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  {getActiveDayData().date}
                </p>

                {/* Calories Circle */}
                <div className="flex justify-center mb-6">
                  <div className="relative w-40 h-40">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#f3f4f6"
                        strokeWidth="10"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="10"
                        strokeDasharray="282.7"
                        strokeDashoffset={
                          282.7 * (1 - getActiveDayData().totalCalories / 2000)
                        }
                        transform="rotate(-90 50 50)"
                      />
                      <text
                        x="50"
                        y="45"
                        fontSize="12"
                        textAnchor="middle"
                        fill="#6b7280"
                      >
                        Calories
                      </text>
                      <text
                        x="50"
                        y="65"
                        fontSize="18"
                        fontWeight="bold"
                        textAnchor="middle"
                        fill="#111827"
                      >
                        {getActiveDayData().totalCalories || 0}
                      </text>
                    </svg>
                  </div>
                </div>

                {/* Macronutrients */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">Carbs</span>
                      <span className="text-gray-600">
                        {getActiveDayData().totalCarbs || 0}g
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${calculatePercentage(
                            getActiveDayData().totalCarbs,
                            getActiveDayData().totalCarbs +
                              getActiveDayData().totalProtein +
                              getActiveDayData().totalFat
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">Protein</span>
                      <span className="text-gray-600">
                        {getActiveDayData().totalProtein || 0}g
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{
                          width: `${calculatePercentage(
                            getActiveDayData().totalProtein,
                            getActiveDayData().totalCarbs +
                              getActiveDayData().totalProtein +
                              getActiveDayData().totalFat
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">Fat</span>
                      <span className="text-gray-600">
                        {getActiveDayData().totalFat || 0}g
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{
                          width: `${calculatePercentage(
                            getActiveDayData().totalFat,
                            getActiveDayData().totalCarbs +
                              getActiveDayData().totalProtein +
                              getActiveDayData().totalFat
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Other Nutrients */}
                <div className="mt-6">
                  <h3 className="font-medium text-gray-700 mb-3">
                    Other Nutrients
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">Sugar</p>
                      <p className="font-bold text-gray-800">
                        {getActiveDayData().totalSugar || 0}g
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">Cholesterol</p>
                      <p className="font-bold text-gray-800">
                        {getActiveDayData().totalCholesterol || 0}mg
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Food Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-bold text-gray-800">
                    Today's Food
                  </h2>
                </div>

                <div className="p-4">
                  {getActiveDayData().foodItems?.length === 0 ? (
                    <div className="p-4 text-center">
                      <p className="text-gray-500">No foods logged today</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {getActiveDayData().foodItems?.map((food, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="mb-2 sm:mb-0">
                            <p className="font-medium text-gray-800">
                              {food.name}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-500">
                              <span className="px-2 py-1 bg-purple-100 rounded-full">
                                Protein: {food.protein}g
                              </span>
                              <span className="px-2 py-1 bg-blue-100 rounded-full">
                                Carbs: {food.carbs}g
                              </span>
                              <span className="px-2 py-1 bg-yellow-100 rounded-full">
                                Fat: {food.fat}g
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center mt-2 sm:mt-0">
                            <span className="font-bold text-gray-800">
                              {food.calories} kcal
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add Food Button - Redirects to /detect */}
                <div className="p-4">
                  <Link
                    to="/detect"
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg flex justify-center items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Add Food
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;