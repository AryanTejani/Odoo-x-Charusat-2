import axios from "axios";
import { create } from "zustand";
const API_URL = "http://localhost:5000/api/auth";

axios.defaults.withCredentials = true;

// Create a custom event for auth changes
const AUTH_CHANGE_EVENT = "auth-state-changed";

// Helper function to broadcast auth state changes
const broadcastAuthChange = (userData) => {
  window.dispatchEvent(
    new CustomEvent(AUTH_CHANGE_EVENT, {
      detail: { user: userData },
    })
  );
};

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        name,
      });
      const userData = response.data.user;
      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      set({ user: userData, isAuthenticated: true, isLoading: false });
      // Broadcast the auth change
      broadcastAuthChange(userData);
      return true;
    } catch (error) {
      console.error("signup error: ", error.response?.data);
      set({
        error: error.response?.data?.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
  
      // Debug response
      console.log("Login response:", response.data);
  
      // Extract token and user separately
      const token = response.data.token;
      const userData = response.data.user;
  
      // Add token to user object
      const userWithToken = {
        ...userData,
        token: token
      };
  
      console.log("User with token:", userWithToken);
  
      // Store user with token in localStorage
      localStorage.setItem("user", JSON.stringify(userWithToken));
      console.log("User stored in localStorage:", userWithToken);
  
      // Verify token was stored correctly
      const storedUser = JSON.parse(localStorage.getItem("user"));
      console.log("Verified user from localStorage:", storedUser);
      console.log("Verified token from localStorage:", storedUser?.token);
  
      set({
        isAuthenticated: true,
        user: userWithToken,
        error: null,
        isLoading: false,
      });
  
      // Broadcast the auth change
      broadcastAuthChange(userWithToken);
      return true;
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      set({
        error: error.response?.data?.message || "Error logging in",
        isLoading: false,
      });
      throw error;
    }
  },
  
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`);
      // Clear user from localStorage
      localStorage.removeItem("user");
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
      // Broadcast the auth change
      broadcastAuthChange(null);
      return true;
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });
      throw error;
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/verify-email`, { code });
      const userData = response.data.user;
      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      set({ user: userData, isAuthenticated: true, isLoading: false });
      // Broadcast the auth change
      broadcastAuthChange(userData);
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error verifying email",
        isLoading: false,
      });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      // First check localStorage
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        set({ user: storedUser, isAuthenticated: true, isCheckingAuth: false });
        console.log("User found in localStorage:", storedUser);
        return true;
      }

      // If not in localStorage, check with server
      const response = await axios.get(`${API_URL}/check-auth`, {
        withCredentials: true,
      });
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        set({
          user: response.data.user,
          isAuthenticated: true,
          isCheckingAuth: false,
        });
        return true;
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      localStorage.removeItem("user");
      set({
        error: null,
        isCheckingAuth: false,
        isAuthenticated: false,
        user: null,
      });
    }
    return false;
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email,
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error.response?.data?.message || "Error sending reset password email",
      });
      throw error;
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, {
        password,
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error resetting password",
      });
      throw error;
    }
  },
}));
