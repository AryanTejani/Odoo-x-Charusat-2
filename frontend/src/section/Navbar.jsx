import { useState, useEffect } from "react";
import {
  FaBars,
  FaTimes,
  FaUser,
  FaSignOutAlt,
  FaTachometerAlt,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo3.png";
import { useAuthStore } from "../store/authStore";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const checkAuth = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("User from localStorage:", user);

    if (user) {
      setIsAuthenticated(true);
      setUsername(user.name);
      console.log("User authenticated:", user.name);
    } else {
      setIsAuthenticated(false);
      setUsername("");
    }
  };

  useEffect(() => {
    // Check if the user is logged in on component mount
    checkAuth();

    // Setup event listener for auth changes
    const handleAuthChange = (event) => {
      console.log("Auth state changed event received:", event.detail);
      checkAuth();
    };

    // Listen for storage events (for when other tabs change auth)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener("auth-state-changed", handleAuthChange);
    window.addEventListener("storage", handleStorageChange);

    // Clean up
    return () => {
      window.removeEventListener("auth-state-changed", handleAuthChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsAuthenticated(false);
      setUsername("");
      navigate("/");
      console.log("User logged out");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Function to handle unauthorized clicks
  const handleUnauthorizedClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      alert("Please sign in to access this feature");
      navigate("/signup");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-100 to-white shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-3 px-4">
        {/* Logo */}
        {isAuthenticated ? (
          <Link to="/dashboard" className="flex items-center">
            <img
              src={logo}
              alt="Logo"
              className="h-10 w-auto transition-transform duration-300 hover:scale-105"
            />
          </Link>
        ) : (
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="Logo"
              className="h-10 w-auto transition-transform duration-300 hover:scale-105"
            />
          </Link>
        )}

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          {isAuthenticated ? (
            // Authenticated navigation items
            <>
              <Link
                to="/workouts"
                className="text-gray-800 text-sm font-medium hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition-all duration-200 py-1"
              >
                Workouts
              </Link>
              <Link
                to="/recipe"
                className="text-gray-800 text-sm font-medium hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition-all duration-200 py-1"
              >
                Recipe
              </Link>
              <Link
                to="/detect"
                className="text-gray-800 text-sm font-medium hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition-all duration-200 py-1"
              >
                Chakra Tracker
              </Link>
              <Link
                to="/ai"
                className="text-gray-800 text-sm font-medium hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition-all duration-200 py-1"
              >
                Personalize Ai
              </Link>
              <Link
                to="/exerciseDashboard"
                className="text-gray-800 text-sm font-medium hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition-all duration-200 py-1"
              >
                Exercise Tracker
              </Link>
              <Link
                to="/exerciseWorkouts"
                className="text-gray-800 text-sm font-medium hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition-all duration-200 py-1"
              >
                Add Exercise
              </Link>
            </>
          ) : (
            // Public navigation items - only show disabled state
            <>
              <span
                onClick={handleUnauthorizedClick}
                className="text-gray-400 cursor-not-allowed  font-medium py-1"
              >
                Workouts
              </span>
              <span
                onClick={handleUnauthorizedClick}
                className="text-gray-400 cursor-not-allowed font-medium py-1"
              >
                Recipe
              </span>
              <span
                onClick={handleUnauthorizedClick}
                className="text-gray-400 cursor-not-allowed font-medium py-1"
              >
                Chakra Tracker
              </span>
              <span
                onClick={handleUnauthorizedClick}
                className="text-gray-400 cursor-not-allowed font-medium py-1"
              >
                Personalize Ai
              </span>
              <span
                onClick={handleUnauthorizedClick}
                className="text-gray-400 cursor-not-allowed font-medium py-1"
              >
                Exercise Tracker
              </span>
              <span
                onClick={handleUnauthorizedClick}
                className="text-gray-400 cursor-not-allowed font-medium py-1"
              >
                Add Exercise
              </span>
            </>
          )}
          {/* Membership is always visible */}
          {/* <Link to="/membership" className="text-blue-600 font-bold hover:text-blue-800 border-b-2 border-transparent hover:border-blue-600 transition-all duration-200 py-1">
            Membership
          </Link> */}
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <div className="flex items-center bg-gray-100 px-3 py-1.5 rounded-lg">
                <FaUser className="text-blue-600 mr-2" />
                <span className="text-gray-800 font-medium">{username}</span>
              </div>
              <Link
                to="/dashboard"
                className="flex items-center text-white bg-blue-600 hover:bg-blue-700 text-sm font-medium px-4 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <FaTachometerAlt className="mr-2" /> Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center text-red-600 hover:text-red-700 font-medium hover:underline"
              >
                <FaSignOutAlt className="mr-1" /> Logout
              </button>
            </>
          ) : (
            <Link
              to="/signup"
              className="flex items-center text-white bg-blue-600 hover:bg-blue-700 text-sm font-medium px-4 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <FaUser className="mr-2" /> Sign In/Register
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-800 hover:text-blue-600 transition-colors duration-200"
        >
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="md:hidden fixed inset-0 bg-white z-40 p-6 shadow-lg">
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-4 right-4 text-gray-800 hover:text-blue-600 transition-colors duration-200"
            >
              <FaTimes size={24} />
            </button>

            {/* Logo in mobile menu */}
            <div className="flex justify-center mb-6 mt-2">
              <img src={logo} alt="Logo" className="h-16 w-auto" />
            </div>

            <nav className="flex flex-col space-y-4 mt-6">
              {isAuthenticated ? (
                // Authenticated mobile navigation
                <div className="flex flex-col overflow-auto text-sm">
                  <Link
                    to="/workouts"
                    onClick={() => setMenuOpen(false)}
                    className="text-gray-800 font-medium hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-gray-100 transition-all duration-200"
                  >
                    Workouts
                  </Link>
                  <Link
                    to="/recipe"
                    onClick={() => setMenuOpen(false)}
                    className="text-gray-800 font-medium hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-gray-100 transition-all duration-200"
                  >
                    Recipe
                  </Link>
                  <Link
                    to="/detect"
                    onClick={() => setMenuOpen(false)}
                    className="text-gray-800 font-medium hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-gray-100 transition-all duration-200"
                  >
                    Chakra Tracker
                  </Link>
                  <Link
                    to="/ai"
                    onClick={() => setMenuOpen(false)}
                    className="text-gray-800 font-medium hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-gray-100 transition-all duration-200"
                  >
                    Personalize Ai
                  </Link>
                  <Link
                    to="/exerciseDashboard"
                    className="text-gray-800 font-medium hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-gray-100 transition-all duration-200"
                  >
                    Exercise Tracker
                  </Link>
                  <Link
                    to="/exerciseWorkouts"
                    className="text-gray-800 font-medium hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-gray-100 transition-all duration-200"
                  >
                    Add Exercise
                  </Link>
                </div>
              ) : (
                // Public mobile navigation - disabled items
                <>
                  <span
                    onClick={(e) => {
                      handleUnauthorizedClick(e);
                      setMenuOpen(false);
                    }}
                    className="text-gray-400 cursor-not-allowed font-medium py-2 px-3 rounded-lg"
                  >
                    Workouts
                  </span>
                  <span
                    onClick={(e) => {
                      handleUnauthorizedClick(e);
                      setMenuOpen(false);
                    }}
                    className="text-gray-400 cursor-not-allowed font-medium py-2 px-3 rounded-lg"
                  >
                    Recipe
                  </span>
                  <span
                    onClick={(e) => {
                      handleUnauthorizedClick(e);
                      setMenuOpen(false);
                    }}
                    className="text-gray-400 cursor-not-allowed font-medium py-2 px-3 rounded-lg"
                  >
                    Chakra Tracker
                  </span>
                  <span
                    onClick={(e) => {
                      handleUnauthorizedClick(e);
                      setMenuOpen(false);
                    }}
                    className="text-gray-400 cursor-not-allowed font-medium py-2 px-3 rounded-lg"
                  >
                    Personalize Ai
                  </span>
                  <span
                    onClick={(e) => {
                      handleUnauthorizedClick(e);
                      setMenuOpen(false);
                    }}
                    className="text-gray-400 cursor-not-allowed font-medium py-2 px-3 rounded-lg"
                  >
                    Exercise Tracker
                  </span>
                  <span
                    onClick={(e) => {
                      handleUnauthorizedClick(e);
                      setMenuOpen(false);
                    }}
                    className="text-gray-400 cursor-not-allowed font-medium py-2 px-3 rounded-lg"
                  >
                    Add Exercise
                  </span>
                </>
              )}

              {/* Membership is always visible */}
              {/* <Link
                to="/membership"
                onClick={() => setMenuOpen(false)}
                className="text-blue-600 font-bold hover:text-blue-800 py-2 px-3 rounded-lg hover:bg-blue-50 transition-all duration-200"
              >
                Membership
              </Link> */}

              <div className="border-t border-gray-200 my-2"></div>

              {isAuthenticated ? (
                <>
                  <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                    <FaUser className="text-blue-600 mr-2" />
                    <span className="text-gray-800 font-medium">
                      Welcome, {username}
                    </span>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 font-medium py-3 px-4 rounded-lg transition-all duration-300"
                  >
                    <FaTachometerAlt className="mr-2" /> Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="flex items-center justify-center text-white bg-red-600 hover:bg-red-700 font-medium py-3 px-4 rounded-lg transition-all duration-300"
                  >
                    <FaSignOutAlt className="mr-2" /> Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 font-medium py-3 px-4 rounded-lg transition-all duration-300"
                >
                  <FaUser className="mr-2" /> Sign In/Register
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
