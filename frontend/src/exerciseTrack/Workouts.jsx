import React, { useEffect, useState, useRef } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import axios from "axios";
import { Home, Dumbbell, Calendar, Plus, Clock, Flame, AlertTriangle } from "lucide-react";
import WorkoutInputGuide from "./WorkoutInputguide";

// WorkoutCard Component
const WorkoutCard = ({ workout }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-all hover:shadow-xl">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white">
        <h3 className="font-bold text-lg">{workout.workoutName || "Workout"}</h3>
        <div className="text-sm opacity-90">
          {new Date(workout.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
        </div>
      </div>
      
      {/* Card Body */}
      <div className="p-5">
        <div className="flex flex-col gap-3">
          <div className="border-b pb-3 border-gray-200 dark:border-gray-700">
            <p className="font-semibold text-gray-800 dark:text-gray-200">
              {workout.workoutName}
            </p>
            <div className="flex gap-4 mt-1">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Dumbbell className="h-4 w-4 mr-1" />
                {workout.sets} sets
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <span className="h-4 w-4 mr-1">🏋️</span>
                {workout.reps} reps
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Flame className="h-4 w-4 mr-1" />
                {workout.weight} kg
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Card Footer */}
      <div className="px-5 py-3 bg-gray-50 dark:bg-gray-700 flex justify-between text-sm">
        <div className="flex items-center text-gray-700 dark:text-gray-300">
          <Clock className="h-4 w-4 mr-1" />
          {workout.duration || "N/A"} min
        </div>
        <div className="flex items-center text-gray-700 dark:text-gray-300">
          <Flame className="h-4 w-4 mr-1" />
          {workout.caloriesBurned || "0"} cal
        </div>
      </div>
    </div>
  );
};

const Workouts = () => {
  const [todaysWorkouts, setTodaysWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [workout, setWorkout] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);
  const [error, setError] = useState("");

  const getTodaysWorkout = async () => {
    setLoading(true);
    try {
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;

      if (!user || !user.token) {
        console.error("No authentication token found in user data");
        setError("You need to log in again.");
        return;
      }

      const url = `http://localhost:5000/api/workout/workout${
        date ? `?date=${date}` : ""
      }`;
      const headers = {
        Authorization: `Bearer ${user.token}`,
      };

      const res = await axios.get(url, { headers });
      setTodaysWorkouts(res?.data?.todaysWorkouts || []);
      console.log("Today's workouts:", res?.data);
    } catch (err) {
      console.error("Error loading workouts:", err);
      setError("Failed to load workouts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    setDate(`${newDate.$M + 1}/${newDate.$D}/${newDate.$y}`);
    setError(""); // Clear any errors when changing date
  };

  const addNewWorkout = async () => {
    setButtonLoading(true);
    setError(""); // Clear any previous errors
    
    try {
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;
  
      if (!user || !user.token) {
        console.error("No authentication token found in user data");
        setError("You need to log in again.");
        return;
      }
  
      const url = "http://localhost:5000/api/workout/addWorkout";
      const headers = {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "application/json",
      };
  
      // Convert selected date to appropriate format
      const formattedDate = selectedDate 
        ? `${selectedDate.$M + 1}/${selectedDate.$D}/${selectedDate.$y}`
        : "";
  
      const response = await axios.post(
        url,
        { 
          workoutString: workout,
          date: formattedDate 
        },
        { headers }
      );
      
      console.log("Workout added successfully:", response.data);
      await getTodaysWorkout();
      setWorkout("");
    } catch (err) {
      console.error(
        "Error adding workout:",
        err.response ? err.response.data : err.message
      );
      
      // Extract the exact error message from the response
      if (err.response && err.response.data) {
        // Check for specific message about duplicate workouts
        if (err.response.data.message && err.response.data.message.includes("already exists for today")) {
          const errorMessage = err.response.data.message;
          setError(errorMessage);
        } else if (err.response.data.message) {
          // Use any other error message provided by the server
          setError(err.response.data.message);
        } else {
          // Fallback for other error types
          setError("Failed to add workout.It's already added on today.");
        }
      } else {
        // Generic error when no specific message is available
        setError("Request failed. Please try again later.");
      }
    } finally {
      setButtonLoading(false);
    }
  };

  useEffect(() => {
    getTodaysWorkout();
  }, [date]);

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="md:col-span-1 bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-teal-600 dark:text-teal-400 mb-4 flex items-center">
              <Calendar className="mr-2 w-6 h-6" /> Select Date
            </h3>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar
                value={selectedDate}
                onChange={handleDateChange}
                className="mx-auto"
              />
            </LocalizationProvider>
          </div>

          {/* Workouts */}
          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
              <Dumbbell className="mr-3 w-8 h-8 text-teal-600" />
              {date ? `Workouts for ${date}` : "Today's Workouts"}
            </h2>

            <div>
              {loading ? (
                <div className="flex justify-center p-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {todaysWorkouts.length === 0 ? (
                    <div className="col-span-full bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-10 text-center border border-gray-200 dark:border-gray-700">
                      <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg">
                        No workouts found for this date.
                      </p>
                      <button
                        onClick={() =>
                          document
                            .getElementById("workout-form")
                            ?.scrollIntoView({ behavior: "smooth" })
                        }
                        className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all flex items-center justify-center space-x-2"
                      >
                        <Plus className="w-5 h-5" />
                        <span>Add Workout</span>
                      </button>
                    </div>
                  ) : (
                    todaysWorkouts.map((workout, index) => (
                      <WorkoutCard
                        key={workout._id || index}
                        workout={workout}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-10">
              <WorkoutInputGuide />
        </div>
        {/* Add Workout Form */}
        <div
          id="workout-form"
          className="mt-10 bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-2xl font-bold text-teal-600 dark:text-teal-400 mb-6 flex items-center">
            <Plus className="mr-2 w-6 h-6" /> Add New Workout
          </h3>
          
          {/* Error Message Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 flex items-start">
              <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Error</p>
                <p>{error}</p>
              </div>
            </div>
          )}
          
          <textarea
            className="w-full p-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 outline-none resize-none min-h-[150px]"
            value={workout}
            onChange={(e) => {
              setWorkout(e.target.value);
              if (error) setError(""); // Clear error when user starts typing
            }}
            placeholder="Enter workout details: Workout name, exercises, sets, reps, weight..."
          />
          <button
            onClick={addNewWorkout}
            disabled={buttonLoading}
            className={`mt-6 w-full py-3 rounded-lg text-white font-semibold transition-all flex items-center justify-center space-x-2 ${
              buttonLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-teal-600 hover:bg-teal-700"
            }`}
          >
            {buttonLoading ? (
              <>
                <span className="animate-spin h-5 w-5 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                Adding...
              </>
            ) : (
              "Add Workout"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Workouts;