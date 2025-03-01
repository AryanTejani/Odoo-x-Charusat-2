import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import imggirl2 from "../assets/gymgirl9.jpg";
import imgboy2 from "../assets/gymboy5.jpg";
import cardio2 from "../assets/cardio2.jpg";
import nutrition from "../assets/n1.jpg";
import meal from "../assets/recipe.jpg";

const featureData = [
  {
    id: 1,
    title: "Nutritional Tracking",
    description:
      "Track your daily nutrition and macronutrient intake <br/>for better fitness results.",
    image: nutrition,
  },
  {
    id: 2,
    title: "Exercise Suggestion",
    description:
      "Get personalized workout recommendations <br/>based on your BMI and fitness goals.",
    image: imgboy2,
  },
  {
    id: 3,
    title: "Meal Suggestion (Recipe)",
    description:
      "Discover healthy meal plans and recipes tailored <br/>to your nutritional needs.",
    image: meal,
  },
  {
    id: 4,
    title: "Cardio Workouts",
    description:
      "Find effective cardio routines to improve  <br/>your cardiovascular health and stamina.",
    image: cardio2,
  },
  {
    id: 5,
    title: "Strength Training",
    description:
      "Build muscle and increase strength <br/>with our specialized training programs.",
    image: imggirl2,
  },
];

const HorizontalFeatureScroll = () => {
  const headingRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [autoScrollPaused, setAutoScrollPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      headingRef.current,
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.5, ease: "elastic.out(1, 0.75)" }
    );

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      const startAutoScroll = () => {
        timerRef.current = setInterval(() => {
          if (!autoScrollPaused && scrollContainerRef.current) {
            const nextIndex = (currentIndex + 1) % featureData.length;
            scrollToIndex(nextIndex);
          }
        }, 5000);
      };

      startAutoScroll();

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [currentIndex, autoScrollPaused, isMobile]);

  const scrollToIndex = (index) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth =
        container.querySelector(".feature-card")?.offsetWidth || 0;
      const scrollPosition = index * (cardWidth + 20);

      gsap.to(container, {
        scrollLeft: scrollPosition,
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => setCurrentIndex(index),
      });
    }
  };

  const handleScroll = (direction) => {
    setAutoScrollPaused(true);
    setTimeout(() => setAutoScrollPaused(false), 3000);

    let newIndex =
      direction === "next"
        ? (currentIndex + 1) % featureData.length
        : (currentIndex - 1 + featureData.length) % featureData.length;

    scrollToIndex(newIndex);
  };

  const handleCardHover = (card) => {
    // gsap.to(card, {
    //   scale: 1.05,
    //   boxShadow: "0 10px 30px rgba(0, 255, 255, 0.3)",
    //   duration: 0.3,
    //   ease: "power2.out",
    // });
  };

  const handleCardLeave = (card) => {
    // gsap.to(card, {
    //   scale: 1,
    //   boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
    //   duration: 0.3,
    //   ease: "power2.out",
    // });
  };

  return (
    <section className="bg-black text-white py-16">
      <h2 className="text-5xl font-bold text-center mb-16" ref={headingRef}>
        Why <span className="text-cyan-500 font-extrabold">Choose Us?</span>
      </h2>

      <div className="relative px-4 md:px-10 max-w-screen-xl mx-auto">
        {!isMobile && (
          <>
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800 hover:bg-cyan-500 p-4 rounded-full transition-all shadow-lg"
              onClick={() => handleScroll("prev")}
              aria-label="Previous feature"
            >
              <FaChevronLeft className="text-white text-sm" />
            </button>
          </>
        )}

        <div
          ref={scrollContainerRef}
          className={`${
            isMobile ? "flex-col" : "flex overflow-x-hidden"
          } snap-x snap-mandatory scroll-smooth gap-8 px-4 md:px-10`}
          onMouseEnter={() => setAutoScrollPaused(true)}
          onMouseLeave={() => setAutoScrollPaused(false)}
        >
          {featureData.map((feature, index) => (
            <div
              key={feature.id}
              className={`feature-card ${
                isMobile
                  ? "w-full"
                  : "min-w-[90%] md:min-w-[80%] lg:min-w-[70%]"
              } flex-shrink-0 snap-center`}
              onMouseEnter={(e) => handleCardHover(e.currentTarget)}
              onMouseLeave={(e) => handleCardLeave(e.currentTarget)}
            >
              <div className="p-8 bg-gray-950 rounded-lg shadow-lg h-auto flex flex-col md:flex-row items-center border-2 border-transparent hover:border-white transition-all duration-300 overflow-hidden">
                <div className="md:w-1/2 mb-6 md:mb-0 overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-[450px] h-[300px] md:h-[400px] object-cover rounded-md border-2 border-white transform transition-transform duration-300 hover:scale-105"
                  />
                </div>

                <div className="md:w-1/2 md:ml-24 text-white text-center md:text-left overflow-hidden">
                  <h2 className="text-2xl font-bold mb-4 text-cyan-500">{feature.title}</h2>
                  <p
                    className="text-lg"
                    dangerouslySetInnerHTML={{ __html: feature.description }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {!isMobile && (
          <>
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800 hover:bg-cyan-500 p-4 rounded-full transition-all shadow-lg"
              onClick={() => handleScroll("next")}
              aria-label="Next feature"
            >
              <FaChevronRight className="text-white text-sm" />
            </button>

            <div className="flex justify-center mt-12 gap-3">
              {featureData.map((_, index) => (
                <button
                  key={index}
                  className={`h-3 w-3 rounded-full transition-all ${
                    currentIndex === index ? "bg-cyan-500 w-8" : "bg-gray-600"
                  }`}
                  onClick={() => scrollToIndex(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default HorizontalFeatureScroll;