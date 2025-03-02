import React, { useState, useEffect, useRef } from "react";
import "react-horizontal-scrolling-menu/dist/styles.css";
import ExerciseCard from "./ExerciseCard";
import BodyPart from "./Bodypart";
import RightArrowIcon from "../../public/assets/icons/right-arrow.png";
import LeftArrowIcon from "../../public/assets/icons/left-arrow.png";

const HorizontalScrollbar = ({
  data,
  bodypartSearch,
  setBodyPart,
  bodyPart,
}) => {
  const scrollContainerRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Calculate max scroll width
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const maxScrollAmount = container.scrollWidth - container.clientWidth;
      setMaxScroll(maxScrollAmount);
      setShowRightArrow(maxScrollAmount > 0);
    }
  }, [data, scrollContainerRef.current?.clientWidth]);

  // Handle scroll event for arrow visibility
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const newPosition = scrollContainerRef.current.scrollLeft;
      setScrollPosition(newPosition);
      setShowLeftArrow(newPosition > 0);
      setShowRightArrow(newPosition < maxScroll - 5);
    }
  };

  // Attach scroll event listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [maxScroll]);

  // Scroll Handlers
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = Math.min(
        scrollContainerRef.current.clientWidth * 0.8,
        scrollPosition
      );
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: scrollContainerRef.current.clientWidth * 0.8,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative w-full overflow-hidden font-sans">
      {/* Left Arrow */}
      {showLeftArrow && (
        <div
          onClick={scrollLeft}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 cursor-pointer flex items-center justify-center w-10 h-10 bg-white/70 rounded-full hover:bg-gray-600/90"
        >
          <img src={LeftArrowIcon} alt="left-arrow" className="w-6 h-auto" />
        </div>
      )}
      {/* Right Arrow */}
      {showRightArrow && (
        <div
          onClick={scrollRight}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 cursor-pointer flex items-center justify-center w-10 h-10 bg-white/70 rounded-full hover:bg-white/90"
        >
          <img src={RightArrowIcon} alt="right-arrow" className="w-6 h-auto" />
        </div>
      )}
      {/* Scrollable Content */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto py-3 px-16 gap-10 font-sans"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#6B7280 #1F2937",
          height: "330px",
          backgroundColor: "#121212", // Dark background that works with black
          borderRadius: "8px",
        }}
      >
        {data.map((item) => (
          <div key={item.id || item} className="mx-5">
            <BodyPart
              item={item}
              setBodyPart={setBodyPart}
              bodyPart={bodyPart}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HorizontalScrollbar;
