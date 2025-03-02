import { useEffect, useState } from "react";
import { fetchHealthdata, fetchHistory } from "../utils/fetchApi.js";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const DashboardPage = () => {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [activeDay, setActiveDay] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [healthData, setHealthData] = useState(null);
  const [suggestedRecipes, setSuggestedRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
          timestamp: food.createdAt,
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
    return (
      history.find((day) => day.dateKey === activeDay) || {
        dateKey: "",
        date: "",
        foodItems: [],
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        totalSugar: 0,
        totalCholesterol: 0,
      }
    );
  };

  // Calculate percentage for macronutrients
  const calculatePercentage = (value, total) => {
    if (!total) return 0;
    return Math.round((value / total) * 100);
  };

  // Calculate remaining calories and protein
  const getRemainingCalories = () => {
    if (!healthData) return 0;
    const dailyCalories = healthData.healthData.dailyCalories;
    const consumedCalories = getActiveDayData().totalCalories;
    return Math.max(0, dailyCalories - consumedCalories);
  };

  const getRemainingProtein = () => {
    if (!healthData) return 0;
    const dailyProtein = healthData.healthData.dailyProtein;
    const consumedProtein = getActiveDayData().totalProtein;
    return Math.max(0, dailyProtein - consumedProtein);
  };

  // Calculate percentage of daily goal consumed
  const getCaloriePercentage = () => {
    if (!healthData) return 0;
    const dailyCalories = healthData.healthData.dailyCalories;
    const consumedCalories = getActiveDayData().totalCalories;
    return Math.min(100, Math.round((consumedCalories / dailyCalories) * 100));
  };

  const getProteinPercentage = () => {
    if (!healthData) return 0;
    const dailyProtein = healthData.healthData.dailyProtein;
    const consumedProtein = getActiveDayData().totalProtein;
    return Math.min(100, Math.round((consumedProtein / dailyProtein) * 100));
  };

  // Enhanced recipe suggestion function that prioritizes higher protein recipes
  // Enhanced recipe suggestion function that prioritizes higher protein recipes
  // Enhanced recipe suggestion function for optimal protein and calories
  // Enhanced recipe suggestion function with detailed debugging
  const fetchSuggestedRecipes = async () => {
    setLoading(true);
    try {
      const remainingCalories = getRemainingCalories();
      console.log("Remaining calories:", remainingCalories);

      if (remainingCalories <= 0) {
        console.log("No remaining calories, skipping recipe fetch");
        setSuggestedRecipes([]);
        return;
      }

      // Updated API URL to the correct endpoint
      const apiUrl = `http://localhost:5000/api/item/all-items/`;
      console.log("Fetching recipes from:", apiUrl);

      // Make the API call
      const response = await axios.get(apiUrl);

      // Detailed logging of the response
      console.log("API response status:", response.status);
      console.log("API response headers:", response.headers);
      console.log("API response data type:", typeof response.data);
      console.log("API response data:", response.data);

      // Check if we got a valid response
      if (!response.data) {
        console.error("API returned empty data");
        setSuggestedRecipes([]);
        return;
      }

      // Since you mentioned the format is an array of objects [{},...],
      // we can directly use response.data as recipes
      let recipes = Array.isArray(response.data) ? response.data : [];

      console.log("Extracted recipes:", recipes.length);

      // For debugging, log the first recipe if available
      if (recipes.length > 0) {
        console.log("Sample recipe structure:", recipes[0]);
      }

      // Continue with the filtering logic as before...
      const eligibleRecipes = recipes.filter((recipe) => {
        // Log each recipe's calorie value for debugging
        console.log(`Recipe "${recipe.name}" calories: ${recipe.calories}`);
        return recipe.calories && recipe.calories <= remainingCalories;
      });

      console.log(
        "Eligible recipes (within calorie limit):",
        eligibleRecipes.length
      );

      if (eligibleRecipes.length === 0) {
        console.log(
          "No eligible recipes found, using low calorie alternatives"
        );
        // If no recipes match the calorie criteria, just get some lower calorie options
        const lowCalorieRecipes = recipes
          .filter((recipe) => recipe.calories)
          .sort((a, b) => a.calories - b.calories)
          .slice(0, 3);

        console.log(
          "Low calorie alternatives found:",
          lowCalorieRecipes.length
        );
        setSuggestedRecipes(lowCalorieRecipes);
      } else {
        // Sort recipes by protein-to-calorie ratio
        const sortedRecipes = [...eligibleRecipes].sort((a, b) => {
          const ratioA = a.protein && a.calories ? a.protein / a.calories : 0;
          const ratioB = b.protein && b.calories ? b.protein / b.calories : 0;
          return ratioB - ratioA; // Highest ratio first
        });

        const topRecipes = sortedRecipes.slice(0, 3);
        console.log(
          "Top recipes selected:",
          topRecipes.map((r) => r.name)
        );
        setSuggestedRecipes(topRecipes);
      }
    } catch (error) {
      console.error("Failed to fetch recipe suggestions", error);
      // More detailed error logging
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      } else if (error.request) {
        console.error("Error request:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      setSuggestedRecipes([]);
    } finally {
      setLoading(false);
    }
  };
  // Fetch recipes when active day changes or on refresh
  useEffect(() => {
    if (activeDay && healthData) {
      fetchSuggestedRecipes();
    }
  }, [activeDay, healthData, refresh]);

  // Calculate protein per calorie ratio (for recipe cards)
  const getProteinCalorieRatio = (protein, calories) => {
    if (!calories) return 0;
    return (protein / calories).toFixed(2);
  };

  // Navigate to recipe detail
  const goToRecipe = (recipeId) => {
    navigate(`/items/${recipeId}`);
  };

  // Format numbers for display
  const formatNumber = (num) => {
    return num.toFixed(1);
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
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Health Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Daily Calories</p>
                <p className="font-bold text-gray-800">
                  {healthData.healthData.dailyCalories} kcal
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Daily Protein</p>
                <p className="font-bold text-gray-800">
                  {healthData.healthData.dailyProtein}g
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">BMI</p>
                <p className="font-bold text-gray-800">
                  {healthData.healthData.bmi}
                </p>
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
            {/* Left Column - Daily Summary & Remaining Nutrients */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                  Daily Summary
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  {getActiveDayData().date}
                </p>

                {/* Calories Progress */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">Calories</span>
                    <span className="text-gray-600">
                      {formatNumber(getActiveDayData().totalCalories || 0)} /{" "}
                      {healthData?.healthData.dailyCalories || 0} kcal
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full"
                      style={{
                        width: `${getCaloriePercentage()}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Protein Progress */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">Protein</span>
                    <span className="text-gray-600">
                      {formatNumber(getActiveDayData().totalProtein || 0)} /{" "}
                      {healthData?.healthData.dailyProtein || 0}g
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-purple-500 h-3 rounded-full"
                      style={{
                        width: `${getProteinPercentage()}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Remaining Nutrients Banner */}
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-blue-700 mb-2">
                    Remaining Today
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500">Calories</p>
                      <p className="font-bold text-gray-800">
                        {formatNumber(getRemainingCalories())} kcal
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Protein</p>
                      <p className="font-bold text-gray-800">
                        {formatNumber(getRemainingProtein())}g
                      </p>
                    </div>
                  </div>
                </div>

                {/* Macronutrients Distribution */}
                <h3 className="font-medium text-gray-700 mb-3">
                  Macronutrient Distribution
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">Carbs</span>
                      <span className="text-gray-600">
                        {formatNumber(getActiveDayData().totalCarbs || 0)}g
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
                        {formatNumber(getActiveDayData().totalProtein || 0)}g
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
                        {formatNumber(getActiveDayData().totalFat || 0)}g
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
                        {formatNumber(getActiveDayData().totalSugar || 0)}g
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">Cholesterol</p>
                      <p className="font-bold text-gray-800">
                        {formatNumber(getActiveDayData().totalCholesterol || 0)}
                        mg
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle/Right Column - Food Items & Recipe Suggestions */}
            <div className="lg:col-span-2">
              {/* Today's Food Items */}
              <div className="bg-white rounded-lg shadow mb-6">
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
                                Protein: {formatNumber(food.protein)}g
                              </span>
                              <span className="px-2 py-1 bg-blue-100 rounded-full">
                                Carbs: {formatNumber(food.carbs)}g
                              </span>
                              <span className="px-2 py-1 bg-yellow-100 rounded-full">
                                Fat: {formatNumber(food.fat)}g
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center mt-2 sm:mt-0">
                            <span className="font-bold text-gray-800">
                              {formatNumber(food.calories)} kcal
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

              {/* Recipe Suggestions */}
              {getRemainingCalories() > 0 && (
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">
                          High-Protein Meal Suggestions
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                          Optimized for your remaining{" "}
                          {formatNumber(getRemainingCalories())} calories
                        </p>
                      </div>
                      <button
                        onClick={fetchSuggestedRecipes}
                        className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-3 rounded-full flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        Refresh
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    {loading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500 mx-auto"></div>
                        <p className="mt-2 text-gray-500">
                          Finding your perfect meal...
                        </p>
                      </div>
                    ) : (
                      <>
                        {getRemainingCalories() <= 0 && (
                          <div className="p-4 text-center mb-4">
                            <div className="bg-amber-100 p-6 rounded-lg border border-amber-200">
                              <h3 className="text-amber-700 font-semibold text-lg">
                                You've reached your calorie goal for today!
                              </h3>
                              <p className="text-amber-600 mt-2">
                                Check back tomorrow for more recipe suggestions.
                              </p>
                            </div>
                          </div>
                        )}

                        {getRemainingCalories() > 0 && (
                          <>
                            {suggestedRecipes.length === 0 ? (
                              <div className="p-4 text-center">
                                <p className="text-gray-500">
                                  No recipe suggestions available at the moment.
                                </p>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {suggestedRecipes.map((recipe) => (
                                  <div
                                    key={recipe._id}
                                    className="bg-white border rounded-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-200 shadow-sm hover:shadow-md"
                                    onClick={() => goToRecipe(recipe._id)}
                                  >
                                    <div className="h-32 overflow-hidden relative">
                                      <img
                                        src={recipe.thumbnail_image}
                                        alt={recipe.name}
                                        className="w-full h-full object-cover"
                                      />
                                      <div className="absolute top-0 right-0 m-2">
                                        <span className="inline-flex items-center px-2 py-1 bg-purple-600 bg-opacity-90 text-white text-xs font-medium rounded-full">
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-3 w-3 mr-1"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M13 10V3L4 14h7v7l9-11h-7z"
                                            />
                                          </svg>
                                          {getProteinCalorieRatio(
                                            recipe.protein,
                                            recipe.calories
                                          )}{" "}
                                          P/Cal
                                        </span>
                                      </div>
                                    </div>
                                    <div className="p-3">
                                      <h3 className="font-semibold text-gray-800 mb-1 truncate">
                                        {recipe.name}
                                      </h3>
                                      <div className="flex flex-wrap gap-1 mb-1">
                                        {recipe.tags &&
                                          recipe.tags
                                            .slice(0, 2)
                                            .map((tag, idx) => (
                                              <span
                                                key={idx}
                                                className="inline-block text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full"
                                              >
                                                {tag}
                                              </span>
                                            ))}
                                      </div>
                                      <div className="grid grid-cols-2 gap-2 mt-2">
                                        <div className="bg-green-50 rounded p-1 text-center">
                                          <span className="block text-xs text-gray-500">
                                            Calories
                                          </span>
                                          <span className="text-sm font-medium text-gray-800">
                                            {recipe.calories}
                                          </span>
                                        </div>
                                        <div className="bg-purple-50 rounded p-1 text-center">
                                          <span className="block text-xs text-gray-500">
                                            Protein
                                          </span>
                                          <span className="text-sm font-medium text-gray-800">
                                            {recipe.protein}g
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="p-2 bg-gray-50 border-t text-center">
                                      <span className="text-xs font-medium text-green-600">
                                        {recipe.more?.difficulty || "Easy"} •{" "}
                                        {recipe.more?.prep_time || "10 min"}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </div>

                  <div className="p-4 border-t">
                    <Link
                      to="/recipe"
                      className="text-green-600 hover:text-green-800 font-medium flex items-center justify-center"
                    >
                      View all recipes
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
