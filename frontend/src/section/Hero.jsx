import { useEffect, useRef } from "react";
import { Typewriter } from "react-simple-typewriter";
import DumbellModel from "../modelsCode/DumbellModel";
import MachineGym from "../modelsCode/MachineGym";

const FitnessHero = () => {
  const textRef = useRef(null);

  useEffect(() => {
    // Fade in main text
    const textElements = textRef.current?.querySelectorAll("h1, h2, p, button");
    textElements?.forEach((el, i) => {
      el.style.opacity = "0";
      setTimeout(() => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0px)";
      }, 200 * i);
    });
  }, []);

  return (
    <div className="relative flex items-center justify-between h-screen bg-black text-gray-100 px-12 gap-16">
      {/* 📌 Left Section (Text) */}
      <div className="max-w-xl flex-1" ref={textRef}>
        <h1 className="text-5xl font-bold">
          Track Your <br /> Calories
        </h1>
        <h2 className="text-3xl font-semibold text-cyan-400 mt-2">
          <Typewriter
            words={["Strength", "Calorie Tracking", "Fat Loss", "Athlete"]}
            loop={0}
            cursor
            cursorStyle="|"
            typeSpeed={150}
            deleteSpeed={75}
            delaySpeed={1000}
          />
        </h2>
        <p className="mt-4 text-gray-300">
          "FUEL UP LIKE A NINJA, TRACK LIKE A SHINOBI." <br />
          <span className="text-xl text-gray-300 font-semibold">
          {'\u00A0'.repeat(48)}- Calorie Sensei
          </span>
        </p>
        <button className="mt-6 bg-cyan-400 text-black font-bold py-3 px-6 rounded-lg hover:bg-green-500">
          Join Us
        </button>
      </div>

      {/* 📌 Center Section (Dumbbell Model) */}
      <div className="flex justify-center items-center w-[100px] h-[70vh]">
        <div className="w-full h-full flex justify-center items-center">
          <DumbellModel />
        </div>
      </div>

      {/* 📌 Right Section (Machine Gym) with Typing Animation */}
      <div className="relative flex-1 flex justify-end h-[80vh]">
        <span
          className="absolute ml-[200px] text-7xl font-bold text-gray-400 whitespace-nowrap transform -translate-x-1/2 -left-16 top-1/3"
        >
          <Typewriter
            words={["CALORIESENSEI"]}
            loop={0}
            cursor
            cursorStyle="|"
            typeSpeed={250}
            deleteSpeed={50}
            delaySpeed={2000}
          />
        </span>
        <MachineGym />
      </div>
    </div>
  );
};

export default FitnessHero;
