import React from "react";
import gym from "../../public/assets/icons/gym.png";

const Bodypart = ({ item, setBodyPart, bodyPart }) => {
  return (
    // Update in the Bodypart.jsx component
    <div
      className={`flex flex-col items-center justify-center w-[270px] h-[230px] cursor-pointer gap-8 rounded-bl-2xl font-sans
    ${
      bodyPart === item
        ? "border-t-4 border-red-600 bg-slate-800"
        : "bg-gray-900"
    }
    hover:shadow-lg hover:bg-gray-800 transition-all duration-300`}
      onClick={() => {
        setBodyPart(item);
        window.scrollTo({
          top: document.documentElement.scrollHeight - 2950,
          left: 0,
          behavior: "smooth",
        });
      }}
    >
      <img src={gym} alt="dumbbell" className="w-10 h-10" />
      <p className="text-xl font-bold text-gray-100 capitalize">{item}</p>
    </div>
  );
};

export default Bodypart;
