// GoalSelectionPage.jsx
import React from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";

const goals = [
  { name: "Fat Loss", path: "/fatloss" },
  { name: "Athlete Training", path: "/athlete" },
  { name: "Weight Gaining", path: "/strength" },
  { name: "General Fitness", path: "/general" },
];

const GoalSelectionPage = () => {
  const navigate = useNavigate();

  const handleSelect = (path) => {
    gsap.to(".goal-card", { opacity: 0, y: -50, duration: 0.5, onComplete: () => navigate("/healthdata") });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8 text-cyan-500">Choose Your Fitness Goal</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal) => (
          <div
            key={goal.name}
            className="goal-card p-6 bg-gray-900 rounded-lg cursor-pointer hover:bg-cyan-700 transition-all"
            onClick={() => handleSelect(goal.path)}
          >
            <h2 className="text-2xl font-bold text-center">{goal.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoalSelectionPage;
