// utils/fetchWorkout.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/workout",
});

// Add a request interceptor that automatically adds the token
export const setupAuthInterceptor = (getToken) => {
  API.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};

// API functions with optional token parameter
export const getDashboardDetails = async (token = null) => {
  try {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await API.get("/dashboard", config);
    return response;
  } catch (error) {
    console.error("Error fetching dashboard:", error);
    throw error;
  }
};

export const getWorkouts = async (date = "", token = null) => {
  try {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await API.get(`/workout${date}`, config);
    return response;
  } catch (error) {
    console.error("Error fetching workouts:", error);
    throw error;
  }
};

export const addWorkout = async (data, token = null) => {
  try {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await API.post(`/addWorkout`, data, config);
    return response;
  } catch (error) {
    console.error("Error adding workout:", error);
    throw error;
  }
};
