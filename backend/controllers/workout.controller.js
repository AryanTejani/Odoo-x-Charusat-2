import { User } from "../models/user.model.js";
import Workout from "../models/workout.model.js";
import createError from "http-errors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

export const getUserDashboard = async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const user = await User.findById(userId);
      if (!user) {
        return next(createError(404, "User not found"));
      }
  
      const currentDateFormatted = new Date();
      const startToday = new Date(
        currentDateFormatted.getFullYear(),
        currentDateFormatted.getMonth(),
        currentDateFormatted.getDate()
      );
      const endToday = new Date(
        currentDateFormatted.getFullYear(),
        currentDateFormatted.getMonth(),
        currentDateFormatted.getDate() + 1
      );
  
      //calculte total calories burnt
      const totalCaloriesBurnt = await Workout.aggregate([
        { $match: { user: user._id, date: { $gte: startToday, $lt: endToday } } },
        {
          $group: {
            _id: null,
            totalCaloriesBurnt: { $sum: "$caloriesBurned" },
          },
        },
      ]);
  
      //Calculate total no of workouts
      const totalWorkouts = await Workout.countDocuments({
        user: userId,
        date: { $gte: startToday, $lt: endToday },
      });
  
      //Calculate average calories burnt per workout
      const avgCaloriesBurntPerWorkout =
        totalCaloriesBurnt.length > 0
          ? totalCaloriesBurnt[0].totalCaloriesBurnt / totalWorkouts
          : 0;
  
      // Fetch category of workouts
      const categoryCalories = await Workout.aggregate([
        { $match: { user: user._id, date: { $gte: startToday, $lt: endToday } } },
        {
          $group: {
            _id: "$category",
            totalCaloriesBurnt: { $sum: "$caloriesBurned" },
          },
        },
      ]);
  
      //Format category data for pie chart
  
      const pieChartData = categoryCalories.map((category, index) => ({
        id: index,
        value: category.totalCaloriesBurnt,
        label: category._id,
      }));
  
      const weeks = [];
      const caloriesBurnt = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(
          currentDateFormatted.getTime() - i * 24 * 60 * 60 * 1000
        );
        weeks.push(`${date.getDate()}th`);
  
        const startOfDay = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate()
        );
        const endOfDay = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate() + 1
        );
  
        const weekData = await Workout.aggregate([
          {
            $match: {
              user: user._id,
              date: { $gte: startOfDay, $lt: endOfDay },
            },
          },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
              totalCaloriesBurnt: { $sum: "$caloriesBurned" },
            },
          },
          {
            $sort: { _id: 1 }, // Sort by date in ascending order
          },
        ]);
  
        caloriesBurnt.push(
          weekData[0]?.totalCaloriesBurnt ? weekData[0]?.totalCaloriesBurnt : 0
        );
      }
  
      return res.status(200).json({
        totalCaloriesBurnt:
          totalCaloriesBurnt.length > 0
            ? totalCaloriesBurnt[0].totalCaloriesBurnt
            : 0,
        totalWorkouts: totalWorkouts,
        avgCaloriesBurntPerWorkout: avgCaloriesBurntPerWorkout,
        totalWeeksCaloriesBurnt: {
          weeks: weeks,
          caloriesBurned: caloriesBurnt,
        },
        pieChartData: pieChartData,
      });
    } catch (err) {
      next(err);
    }
  };
  
  export const getWorkoutsByDate = async (req, res, next) => {
    try {
      const userId = req.user?.id; // Extract user ID from the token
      const user = await User.findById(userId);
      
      if (!user) {
        return next(createError(404, "User not found"));
      }
  
      // Parse the date from the query or default to today
      let date = req.query.date ? new Date(req.query.date) : new Date();
      
      // Define start and end of the day for filtering
      const startOfDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
      const endOfDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + 1
      );
  
      // Query the workouts using the correct user field
      const todaysWorkouts = await Workout.find({
        user: userId, // Use 'user' instead of 'userId'
        date: { $gte: startOfDay, $lt: endOfDay }, // Ensure the date field matches your schema
      });
  
      // Calculate total calories burnt
      const totalCaloriesBurnt = todaysWorkouts.reduce(
        (total, workout) => total + workout.caloriesBurned,
        0
      );
  
      // Return the workouts and total calories burnt
      return res.status(200).json({ todaysWorkouts, totalCaloriesBurnt });
    } catch (err) {
      console.error("Error fetching workouts:", err); // Log the error for debugging
      next(err); // Pass the error to the error handling middleware
    }
  };
  
  
  export const addWorkout = async (req, res, next) => {
    try {
      const userId = req.user?.id; // Get user ID from the token
      console.log("userId", userId);
      const { workoutString } = req.body; // Get workout string from request body
      const workoutDate = req.body.date ? new Date(req.body.date) : new Date(); // Use provided date or current date
  
      // Check if workoutString is provided
      if (!workoutString) {
        return next(createError(400, "Workout string is missing"));
      }
  
      // Split workoutString into lines
      const eachworkout = workoutString.split(";").map((line) => line.trim());
      // Check if any workouts start with "#" to indicate categories
      const categories = eachworkout.filter((line) => line.startsWith("#"));
      if (categories.length === 0) {
        return next(createError(400, "No categories found in workout string"));
      }
  
      const parsedWorkouts = [];
      let currentCategory = "";
      let count = 0;
  
      // Loop through each line to parse workout details
      eachworkout.forEach((line) => {
        count++;
        if (line.startsWith("#")) {
          const parts = line.split("\n").map((part) => part.trim());
          if (parts.length < 5) {
            return next(createError(400, `Workout string is missing for ${count}th workout`));
          }
  
          // Update current category
          currentCategory = parts[0].substring(1).trim();
          // Extract workout details
          const workoutDetails = parseWorkoutLine(parts);
          if (workoutDetails == null) {
            return next(createError(400, "Please enter in proper format"));
          }
  
          if (workoutDetails) {
            // Add category to workout details
            workoutDetails.category = currentCategory;
            // Add date to workout details
            workoutDetails.date = workoutDate;
            parsedWorkouts.push(workoutDetails);
          }
        } else {
          return next(createError(400, `Workout string is missing for ${count}th workout`));
        }
      });
  
      // Check for existing workouts before inserting
      for (const workout of parsedWorkouts) {
        // Create new Date objects for start and end of day
        const startOfDay = new Date(workoutDate);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(workoutDate);
        endOfDay.setHours(23, 59, 59, 999);
        
        // Check if this workout already exists for this user ON THIS DATE
        const existingWorkout = await Workout.findOne({
          workoutName: workout.workoutName,
          user: userId,
          date: {
            $gte: startOfDay,
            $lt: endOfDay
          }
        });
  
        if (existingWorkout) {
          return next(createError(400, `Workout '${workout.workoutName}' already exists for today. You cannot add the same exercise twice on the same day.`));
        }
  
        workout.caloriesBurned = calculateCaloriesBurnt(workout); // Calculate calories burned
        await Workout.create({ ...workout, user: userId }); // Store the workout in the database
      }
  
      // Create new Date objects again for fetching today's workouts
      const startOfDay = new Date(workoutDate);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(workoutDate);
      endOfDay.setHours(23, 59, 59, 999);
      
      // Fetch updated workouts
      const todaysWorkouts = await Workout.find({ 
        user: userId,
        date: {
          $gte: startOfDay,
          $lt: endOfDay
        }
      });
      
      return res.status(201).json({
        message: "Workouts added successfully",
        todaysWorkouts, // Return the updated list of workouts
      });
    } catch (err) {
      console.error("Error in addWorkout:", err); // Log the error for debugging
      next(err); // Pass the error to the error handling middleware
    }
  };
  
  // Function to parse workout details from a line
  const parseWorkoutLine = (parts) => {
    const details = {};
    if (parts.length >= 5) {
      details.workoutName = parts[1].substring(1).trim();
      details.sets = parseInt(parts[2].split("sets")[0].substring(1).trim());
      details.reps = parseInt(parts[2].split("sets")[1].split("reps")[0].substring(1).trim());
      details.weight = parseFloat(parts[3].split("kg")[0].substring(1).trim());
      details.duration = parseFloat(parts[4].split("min")[0].substring(1).trim());
      return details;
    }
    return null;
  };
  
  // Function to calculate calories burnt for a workout
  const calculateCaloriesBurnt = (workoutDetails) => {
  const { sets, reps, weight, duration } = workoutDetails;
  
  const MET = 6; // Metabolic Equivalent of Task (6 is an average value for weight training)
  const weightInKg = parseFloat(weight) || 0;
  const durationInMinutes = parseFloat(duration) || 0;
  
  // Basic calorie formula: (MET × weight in kg × time in hours)
  let caloriesFromDuration = (MET * weightInKg * (durationInMinutes / 60));

  // Additional calorie estimate from weight lifted
  let totalWeightLifted = sets * reps * weightInKg;
  let caloriesFromLifting = totalWeightLifted * 0.1; // Rough estimate: 0.1 kcal per kg lifted

  return (caloriesFromDuration + caloriesFromLifting).toFixed(2); // Return rounded value
};