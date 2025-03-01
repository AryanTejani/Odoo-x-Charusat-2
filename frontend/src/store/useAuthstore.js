// useAuthStore.js
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.login({ email, password }); // Replace with your API call
      const userData = response.data; // Assuming the API returns user data

      // Update state
      set({ isAuthenticated: true, user: userData, isLoading: false });

      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  logout: () => {
    set({ isAuthenticated: false, user: null });
    localStorage.removeItem("user");
  },
}));