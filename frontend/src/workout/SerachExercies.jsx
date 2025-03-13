import React, { useEffect, useState } from "react";
import { exerciseOptions, fetchData } from "../utils/Fetchdata";
import HorizontalScrollbar from "./HorizontalScrollbar";

const SearchExercises = ({ setExercises, bodyparts, setBodyParts }) => {
  const [search, setSearch] = useState("");
  const [bodypartSearch, setbodypartSearch] = useState([]);

  useEffect(() => {
    const fetchExercisedata = async () => {
      try {
        const bodyParts = await fetchData(
          "https://exercisedb.p.rapidapi.com/exercises/bodyPartList",
          exerciseOptions
        );
        console.log("Fetched body parts:", bodyParts); // Debugging log
        if (Array.isArray(bodyParts)) {
          setbodypartSearch(["all", ...bodyParts]);
        } else {
          console.error("Unexpected response format:", bodyParts);
        }
      } catch (error) {
        console.error("Error fetching body parts:", error);
      }
    };
    fetchExercisedata();
  }, []);

  const handleSearch = async () => {
    if (search) {
      const exerciseData = await fetchData(
        "https://exercisedb.p.rapidapi.com/exercises",
        exerciseOptions
      );
      const searchedExercises = exerciseData.filter(
        (exercise) =>
          exercise.name.toLowerCase().includes(search) ||
          exercise.target.toLowerCase().includes(search) ||
          exercise.equipment.toLowerCase().includes(search) ||
          exercise.bodyPart.toLowerCase().includes(search)
      );
      setSearch("");
      setExercises(searchedExercises);
      console.log(exerciseData);
    }
  };

  return (
    <div className="flex flex-col items-center mt-20 p-5 bg-black text-white">
      <h1 className="font-bold text-4xl lg:text-5xl text-center mb-12">
        Awesome Exercises You <br /> Should Know
      </h1>
      <div className="relative mb-24 w-full max-w-4xl">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value.toLowerCase())}
          placeholder="Search Exercises"
          className="w-full p-4 pl-6 pr-24 font-bold text-black rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <button
          onClick={handleSearch}
          className="absolute right-0 top-0 bg-red-600 text-white font-bold py-4 px-8 rounded-full hover:bg-red-700 transition-colors"
        >
          Search
        </button>
      </div>
      <div className="w-full p-5">
        <HorizontalScrollbar
          data={bodypartSearch}
          bodypartSearch
          setBodyPart={setBodyParts}
          bodyPart={bodyparts}
        />
      </div>
    </div>
  );
};

export default SearchExercises;