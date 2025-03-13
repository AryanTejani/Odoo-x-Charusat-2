import React, { useEffect, useState } from "react";
import { counts } from "../utils/data";
import axios from "axios";
import WorkoutCard from "./WorkoutCard";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import WorkoutInputGuide from "./WorkoutInputguide";

const COLORS = {
  'Legs': '#0088FE',
  'Chest': '#00C49F',
  'Back': '#FFBB28',
  'Arms': '#FF8042',
  'Shoulders': '#8884D8',
  'default': '#37474F'
};

const StatCard = ({ icon, title, value, percentage, unit, color }) => (
  <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col">
    <div className="flex justify-between items-center mb-3">
      <div className="p-2 rounded-full" style={{ backgroundColor: color + '20' }}>
        <span style={{ color: color }}>{icon}</span>
      </div>
      <span className="text-green-500 font-medium">+{percentage}%</span>
    </div>
    <h3 className="text-gray-600 mb-2">{title}</h3>
    <div className="flex items-end">
      <span className="text-2xl font-bold mr-2">{value}</span>
      <span className="text-gray-500 text-sm">{unit}</span>
    </div>
  </div>
);

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [buttonLoading, setButtonLoading] = useState(false);
  const [todaysWorkouts, setTodaysWorkouts] = useState([]);
  const [workout, setWorkout] = useState("");
  const [date, setDate] = useState("");
  const [workoutCategories, setWorkoutCategories] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  // Function to handle responsive layout
  const handleResize = () => {
    setIsMobile(window.innerWidth <= 1024);
  };

  useEffect(() => {
    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
    
    // Initial data fetch
    dashboardData();
    getTodaysWorkout();

    // Cleanup event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [date]);

  const processWorkoutCategories = (workouts) => {
    const categoryMap = {};

    workouts.forEach(workout => {
      const category = workout.category;
      
      if (categoryMap[category]) {
        categoryMap[category] += workout.caloriesBurned;
      } else {
        categoryMap[category] = workout.caloriesBurned;
      }
    });

    const categoriesData = Object.keys(categoryMap).map((category) => ({
      name: category,
      value: categoryMap[category],
      color: COLORS[category] || COLORS['default']
    }));

    return categoriesData;
  };

  const dashboardData = async () => {
    setLoading(true);
    try {
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;

      if (!user || !user.token) {
        alert("You need to log in again.");
        return;
      }

      const headers = {
        Authorization: `Bearer ${user.token}`,
      };

      const res = await axios.get(
        "http://localhost:5000/api/workout/dashboard",
        { headers }
      );
      setData(res?.data || {});

    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const getTodaysWorkout = async () => {
    setLoading(true);
    try {
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;

      if (!user || !user.token) {
        alert("You need to log in again.");
        return;
      }

      const headers = {
        Authorization: `Bearer ${user.token}`,
      };

      const url = `http://localhost:5000/api/workout/workout${
        date ? `?date=${date}` : ""
      }`;
      const res = await axios.get(url, { headers });
      
      const todaysWorkouts = res?.data?.todaysWorkouts || [];
      setTodaysWorkouts(todaysWorkouts);
      
      // Process workout categories for pie chart
      const categoriesData = processWorkoutCategories(todaysWorkouts);
      setWorkoutCategories(categoriesData);

    } catch (err) {
      console.error("Error loading today's workouts:", err);
    } finally {
      setLoading(false);
    }
  };

  const addNewWorkout = async () => {
    setButtonLoading(true);
    try {
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;

      if (!user || !user.token) {
        alert("You need to log in again.");
        return;
      }

      const headers = {
        Authorization: `Bearer ${user.token}`,
      };

      await axios.post(
        "http://localhost:5000/api/workout/addWorkout",
        { workoutString: workout },
        { headers }
      );

      await dashboardData();
      await getTodaysWorkout();
      setWorkout(""); // Clear the textarea after adding workout
    } catch (err) {
      alert(err.message || "Error adding workout");
    } finally {
      setButtonLoading(false);
    }
  };

  useEffect(() => {
    dashboardData();
    getTodaysWorkout();
  }, [date]);

  return (
    <div className="bg-gray-50 min-h-screen p-4 lg:p-8">
      <div className="container mx-auto max-w-6xl">
        {/* Navigation remains the same */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <nav className="hidden lg:flex space-x-4">
              <a href="#" className="text-blue-600 font-medium">Dashboard</a>
              <a href="#" className="text-gray-600">Workouts</a>
              <a href="#" className="text-gray-600">Tutorials</a>
              <a href="#" className="text-gray-600">Blogs</a>
              <a href="#" className="text-gray-600">Contact</a>
            </nav>
            <button className="bg-gray-200 px-4 py-2 rounded-full">Logout</button>
          </div>
        </div>

        {/* Stat Cards - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {counts.map((item, index) => (
            <StatCard 
              key={index}
              icon={item.icon}
              title={item.name}
              value={data[item.key] || 0}
              percentage={10}
              unit={item.unit}
              color={item.color}
            />
          ))}
        </div>

        {/* Main Content - Responsive Layout */}
        {isMobile ? (
          <div className="space-y-6">
            {/* Workout Categories */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Workout Categories</h2>
              {workoutCategories.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={workoutCategories}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius="70%"
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => 
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {workoutCategories.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name, props) => [
                        `${value} calories`, 
                        name,
                        { fill: props.payload.color }
                      ]}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                        borderRadius: '10px' 
                      }}
                    />
                    <Legend 
                      layout="horizontal" 
                      verticalAlign="bottom" 
                      align="center"
                      formatter={(value, entry) => `${value}`}
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-gray-500 h-64 flex items-center justify-center">
                  No workout categories for today
                </div>
              )}
            </div>
            

            {/* Today's Workouts */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Today's Workouts</h2>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {todaysWorkouts.length === 0 ? (
                    <div className="col-span-1 sm:col-span-2 bg-white rounded-2xl p-10 text-center shadow-md">
                      <p className="text-gray-500">No workouts today. Add one to get started!</p>
                    </div>
                  ) : (
                    todaysWorkouts.map((workout) => (
                      <WorkoutCard key={workout._id} workout={workout} />
                    ))
                  )}
                </div>
              )}
            </div>
              <WorkoutInputGuide/>
            {/* Add New Workout */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Add New Workout</h2>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 mb-4 h-32"
                placeholder="Enter workout details (e.g., Category - Workout Name, Sets x Reps, Weight)"
                value={workout}
                onChange={(e) => setWorkout(e.target.value)}
              />
              <button
                onClick={addNewWorkout}
                disabled={buttonLoading || !workout.trim()}
                className={`w-full py-3 rounded-lg text-white ${
                  buttonLoading || !workout.trim()
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {buttonLoading ? "Adding..." : "Add Workout"}
              </button>
            </div>
          </div>
        ) : (
          
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-8">
              <WorkoutInputGuide/>
              <div>
                <h2 className="text-2xl font-semibold mb-4">Today's Workouts</h2>
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-6">
                    {todaysWorkouts.length === 0 ? (
                      <div className="col-span-3 bg-white rounded-2xl p-10 text-center shadow-md">
                        <p className="text-gray-500">No workouts today. Add one to get started!</p>
                      </div>
                    ) : (
                      todaysWorkouts.map((workout) => (
                        <WorkoutCard key={workout._id} workout={workout} />
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
                
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Workout Categories</h2>
                {workoutCategories.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={workoutCategories}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius="80%"
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent, value }) => 
                          `${name} ${(percent * 100).toFixed(0)}% (${value} cal)`
                        }
                      >
                        {workoutCategories.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.color} 
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name, props) => [
                          `${value} calories`, 
                          name,
                          { fill: props.payload.color }
                        ]}
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                          borderRadius: '10px' 
                        }}
                      />
                      <Legend 
                        layout="horizontal" 
                        verticalAlign="bottom" 
                        align="center"
                        formatter={(value, entry) => `${value} (${entry.payload.value} cal)`}
                        iconType="circle"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center text-gray-500 h-64 flex items-center justify-center">
                    No workout categories for today
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Add New Workout</h2>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 mb-4 h-32"
                  placeholder="Enter workout details (e.g., Category - Workout Name, Sets x Reps, Weight)"
                  value={workout}
                  onChange={(e) => setWorkout(e.target.value)}
                />
                <button
                  onClick={addNewWorkout}
                  disabled={buttonLoading || !workout.trim()}
                  className={`w-full py-3 rounded-lg text-white ${
                    buttonLoading || !workout.trim()
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  {buttonLoading ? "Adding..." : "Add Workout"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;