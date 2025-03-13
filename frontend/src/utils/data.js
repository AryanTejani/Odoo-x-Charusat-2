// utils/data.js - Alternative approach without JSX
import {
    FitnessCenterRounded,
    LocalFireDepartmentRounded,
    TimelineRounded,
  } from "@mui/icons-material";
  
  // Define icons outside the data structure
  const fitnessIcon = FitnessCenterRounded;
  const fireIcon = LocalFireDepartmentRounded;
  const timelineIcon = TimelineRounded;
  
  export const counts = [
    {
      name: "Calories Burned",
      iconType: fireIcon,
      desc: "Total calories burned today",
      key: "totalCaloriesBurnt",
      unit: "kcal",
      color: "#eb9e34",
      lightColor: "#FDF4EA",
    },
    {
      name: "Workouts",
      iconType: fitnessIcon,
      desc: "Total no of workouts for today",
      key: "totalWorkouts",
      unit: "",
      color: "#41C1A6",
      lightColor: "#E8F6F3",
    },
    {
      name: "Average Calories Burned",
      iconType: timelineIcon,
      desc: "Average Calories Burned on each workout",
      key: "avgCaloriesBurntPerWorkout",
      unit: "kcal",
      color: "#FF9AD5",
      lightColor: "#FEF3F9",
    },
  ];
  