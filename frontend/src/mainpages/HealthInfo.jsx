import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./HeathInfo.css"; // Note: There's a typo here - should be "HealthInfo.css"

const HealthInfo = () => {
  const [formData, setFormData] = useState({
    bodyWeight: "",
    height: ""
  });
  const [healthData, setHealthData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(5); // Changed to 5 seconds as requested
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("You must be logged in to update health information");
        setIsLoading(false);
        return;
      }

      // Fixed template literal syntax with proper backticks
      const response = await axios.post(
        "http://localhost:5000/api/health/update-health",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setHealthData(response.data);
      console.log("Health data received:", response.data);
      
      // Start countdown for redirect
      let timer = 5; // Changed to 5 seconds as requested
      const countdownInterval = setInterval(() => {
        timer--;
        setCountdown(timer);
        
        if (timer <= 0) {
          clearInterval(countdownInterval);
          navigate("/dashboard");
        }
      }, 1000);
      
    } catch (error) {
      console.error("Error updating health data:", error);
      setError(error.response?.data?.message || "Failed to update health information");
    } finally {
      setIsLoading(false);
    }
  };

  // Animate the component when it mounts
  useEffect(() => {
    const healthContainer = document.querySelector(".health-container");
    if (healthContainer) {
      healthContainer.classList.add("fade-in");
    }
  }, []);

  return (
    <div className="health-page">
      <div className="health-container">
        <h1 className="page-title">Your Health Profile</h1>
        
        <form onSubmit={handleSubmit} className="health-form">
          <div className="form-group">
            <label htmlFor="bodyWeight">Body Weight (kg)</label>
            <input
              type="number"
              id="bodyWeight"
              name="bodyWeight"
              value={formData.bodyWeight}
              onChange={handleChange}
              placeholder="Enter your weight in kg"
              required
              min="20"
              max="300"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="height">Height (cm)</label>
            <input
              type="number"
              id="height"
              name="height"
              value={formData.height}
              onChange={handleChange}
              placeholder="Enter your height in cm"
              required
              min="100"
              max="250"
            />
          </div>
          
          {/* Fixed template literal syntax with proper backticks */}
          <button 
            type="submit" 
            className={`submit-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Calculate Health Metrics"}
          </button>
        </form>
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}
        
        {healthData && (
  <div className="results-container">
    <h2>Your Health Results</h2>

    <div className="metrics-grid">
      <div className="metric-card bmi">
        <h3>BMI</h3>
        <div className="metric-value">{parseFloat(healthData.healthData?.bmi || healthData.bmi).toFixed(1)}</div>
        <p className="metric-description">
          {getBmiCategory(healthData.healthData?.bmi || healthData.bmi)}
        </p>
      </div>

      <div className="metric-card calories">
        <h3>Daily Calories</h3>
        <div className="metric-value">{healthData.healthData?.dailyCalories || healthData.dailyCalories}</div>
        <p className="metric-description">kcal per day</p>
      </div>

      <div className="metric-card protein">
        <h3>Daily Protein</h3>
        <div className="metric-value">{healthData.healthData?.dailyProtein || healthData.dailyProtein}</div>
        <p className="metric-description">grams per day</p>
      </div>
    </div>
  </div>
)}

      </div>
    </div>
  );
};

// Helper function to categorize BMI
function getBmiCategory(bmi) {
  const bmiValue = parseFloat(bmi);
  
  if (bmiValue < 18.5) return "Underweight";
  if (bmiValue < 25) return "Normal weight";
  if (bmiValue < 30) return "Overweight";
  return "Obese";
}

export default HealthInfo;