import axios from "axios";
import React, { useEffect, useState } from "react";
import Card from "./Card";

const LatestRecipe = () => {
  const [items, setItems] = useState([]);
  const [showAll, setShowAll] = useState(false); // Track whether to show all recipes

  useEffect(() => {
    const getLatestItems = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/item/all-items");
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };
    getLatestItems();
  }, []);

  return (
    <div className="px-5 xl:px-10 py-16">
      <h2 className="text-3xl mb-8 font-semibold text-secondary sm:text-5xl sm:leading-relaxed">
        Latest recipes
      </h2>

      {/* Display Recipes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {items.length > 0 ? (
          (showAll ? items : items.slice(0, 4)).map((item, index) => (
            <Card key={index} item={item} className="min-h-[400px] flex flex-col justify-between" />
          ))
        ) : (
          <p>Loading....</p>
        )}
      </div>

      {/* Show All Recipes Button */}
      {!showAll && items.length > 4 && (
        <div className="sm:w-64 mx-auto mt-16">
          <button
            type="button"
            onClick={() => setShowAll(true)} // Show all recipes
            className="py-4 px-8 hover:bg-btnColor hover:text-white text-secondary w-full transition ease-in duration-200 text-center text-base font-semibold border border-[#9c702a] focus:outline-none rounded-lg"
          >
            View All Recipes
          </button>
        </div>
      )}
    </div>
  );
};

export default LatestRecipe;
