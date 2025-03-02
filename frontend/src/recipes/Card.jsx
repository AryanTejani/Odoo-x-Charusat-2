import React from "react";
import ClockImg from "../assets/clock.svg"
import { Link } from "react-router-dom";

const Card = ({ item }) => {
  const categoryStyles = {
    Entrees: { backgroundColor: "#f0f5c4", color: "#59871f" },
    Breakfast: { backgroundColor: "#efedfa", color: "#3c3a8f" },
    Lunch: { backgroundColor: "#e5f7f3", color: "#1f8787" },
    Desserts: { backgroundColor: "#e8f5fa", color: "#397a9e" },
    Sides: { backgroundColor: "#feefc9", color: "#d16400" },
    Drinks: { backgroundColor: "#ffeae3", color: "#f0493e" },
    // Add more categories and their styles here
    default: { backgroundColor: "#fff", color: "#000" },
  };

  const getCategoryStyle = (category) => {
    return categoryStyles[category] || categoryStyles.default;
  };

  const categoryStyle = getCategoryStyle(item?.category);

  return (
    <div className="w-full px-2 mb-6">
      <div className="h-full bg-white relative shadow-lg hover:shadow-xl transition duration-500 rounded-lg flex flex-col">
        <div className="h-56 overflow-hidden rounded-t-lg">
          <img 
            className="w-full h-full object-cover" 
            src={item?.thumbnail_image} 
            alt={item?.name || "Recipe"} 
          />
        </div>
        <div className="p-5 rounded-lg bg-white flex-grow flex flex-col justify-between">
          <Link to={`/items/${item._id}`} className="block">
            <h1 className="text-gray-700 font-bold text-xl mb-3 hover:text-gray-900 hover:cursor-pointer line-clamp-2">
              {item?.name}
            </h1>
          </Link>
          
          {/* category & reading time */}
          <div className="flex justify-between items-center mt-auto">
            <button
              className="py-1 px-3 text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition duration-300"
              style={{
                backgroundColor: categoryStyle.backgroundColor,
                color: categoryStyle.color,
              }}
            >
              {item?.category}
            </button>
            <div className="flex items-center py-1">
              <img
                src={ClockImg}
                loading="lazy"
                alt=""
                className="w-4 h-4"
              />
              <div className="ml-1 text-sm">30 minutes</div>
            </div>
          </div>
        </div>
        <div className="absolute top-2 right-2 py-1 px-3 bg-white rounded-lg">
          <span className="text-sm">{item?.more?.difficulty}</span>
        </div>
      </div>
    </div>
  );
};

export default Card;