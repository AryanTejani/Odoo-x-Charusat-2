import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import FloatingShape from "./components/FloatingShape";
import Home from "./mainpages/Home";
import Workout from "./mainpages/Workout";
import Navbar from "./section/Navbar";
import SignUpPage from "./mainpages/SignUpPage";
import LoginPage from "./mainpages/LoginPage";
import EmailVerificationPage from "./mainpages/EmailVerificationPage";
import DashboardPage from "./chakratracker/DashboardPage";
import ForgotPasswordPage from "./mainpages/ForgotPasswordPage";
import ResetPasswordPage from "./mainpages/ResetPasswordPage";
import LoadingSpinner from "./components/LoadingSpinner";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import ExerciseDetails from "./workout/ExerciseDetails";
import GoalSelectionPage from "./section/Goalselection";
import RecipeHome from "./recipes/RecipeHome";
import Category from "./recipes/Category";
import SerachPage from "./recipes/SerachPage";
import SingleProduct from "./recipes/SingleProduct";
import History from "./chakratracker/History";
import ImageUpload from "./chakratracker/ChakraTracker";
import Membership from "./section/Membership";
import Ai from "./section/Ai";
import HealthInfo from "./mainpages/HealthInfo";
import Dashboard from "./exerciseTrack/Dashboard";
// In your App.js or index.js
import { setupAuthInterceptor } from './utils/fetchWorkout';
import Workouts from "./exerciseTrack/Workouts";
import {  setupAxiosInterceptors } from "./utils/setupInterceptors";

// Setup the interceptor with a function that gets the token

// import FatLossPage from "./ExerciseAfterLogin/Fatloss";

// protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

// redirect authenticated users to the home page
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user.isVerified) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  const [history, setHistory] = useState([]);

  const location = useLocation();
  const hideNavbar = location.pathname === "/dashboard";
  const handleUploadSuccess = (newEntry) => {
    setHistory([newEntry, ...history]);
  };

  useEffect(() => {
    setupAxiosInterceptors();
    console.log('Axios interceptors setup complete');
  }, []);

  const { isCheckingAuth, checkAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto">
      {/* {!hideNavbar && <Navbar />} */}
      <Navbar />

      <Routes>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <RedirectAuthenticatedUser>
              <SignUpPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <LoginPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route
          path="/forgot-password"
          element={
            <RedirectAuthenticatedUser>
              <ForgotPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />

        <Route
          path="/reset-password/:token"
          element={
            <RedirectAuthenticatedUser>
              <ResetPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route path="/" element={<Home />} />
        <Route path="/workouts" element={<Workout />} />
        <Route path="/exercise/:id" element={<ExerciseDetails />} />
        <Route path="/goal-selection" element={<GoalSelectionPage />} />
        <Route path="/recipe" element={<RecipeHome />} />
        <Route path="/categories/:category" element={<Category />} />
        <Route path="/search" element={<SerachPage />} />
        <Route path="/items/:id" element={<SingleProduct />} />
        <Route path="/healthdata" element={<HealthInfo/>}/>
        <Route
          path="/detect"
          element={<ImageUpload onUploadSuccess={handleUploadSuccess} />}
        />
        <Route path="/history" element={<History />} />
        {/* <Route path="/membership" element={<Membership />} /> */}
        <Route path="/ai" element={<Ai />} />
        <Route path="/exerciseDashboard" element={<Dashboard />} />
        <Route path="/exerciseWorkouts" element={<Workouts />} />
        {/* catch all routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
