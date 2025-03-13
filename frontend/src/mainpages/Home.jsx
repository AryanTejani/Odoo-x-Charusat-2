import React from "react";
import FitnessHero from "../section/Hero";
import ServicesSection from "../workout/Services";
import RotatingFeature from "../section/About";
import Footer from "../section/Footer";
import { useState } from "react";
const Home = () => {
  const [exercise, setExercises] = useState([]);
  const [bodyparts, setBodyparts] = useState("all");

  console.log(bodyparts)

  return (
    <div>
      <FitnessHero />
      <ServicesSection />
      <RotatingFeature />
      {/* <SerachExercies
  setExercises={setExercises}
  bodyparts={bodyparts}
  setBodyParts={setBodyparts}
/>

      <Exercises
        exercises={exercise}
        setExercises={setExercises}
        bodyPart={bodyparts}
      /> */}
      <Footer />
    </div>
  );
};

export default Home;
