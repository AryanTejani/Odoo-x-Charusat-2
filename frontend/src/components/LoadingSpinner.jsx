import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const LoadingSpinner = () => {
  const containerRef = useRef(null);
  const lettersRef = useRef([]);
  const wrapperRef = useRef(null);
  
  // Reset refs array for each letter
  lettersRef.current = [];
  
  // Add element to the refs array
  const addToRefs = (el) => {
    if (el && !lettersRef.current.includes(el)) {
      lettersRef.current.push(el);
    }
  };
  
  useEffect(() => {
    // Set the 45-degree rotation on the wrapper
    gsap.set(wrapperRef.current, { 
      rotation: 45,
      transformOrigin: "center center"
    });
    
    // Create the loading animation
    const tl = gsap.timeline({ repeat: -1 });
    
    // First set all letters to dim state
    gsap.set(lettersRef.current, { 
      autoAlpha: 0.3,
      color: "#9CA3AF" // gray-400
    });
    
    // Then highlight each letter sequentially
    lettersRef.current.forEach((letter, index) => {
      tl.to(letter, {
        autoAlpha: 1,
        color: index < 7 ? "#059669" : "#065F46", // green-600 for Calorie, green-800 for Sensei
        textShadow: "0 0 10px rgba(5, 150, 105, 0.5)",
        scale: 1.2,
        duration: 0.3,
        ease: "power2.inOut"
      }, index * 0.15);
      
      // Return to normal state (except keep visible)
      if (index < lettersRef.current.length - 1) {
        tl.to(letter, {
          scale: 1,
          textShadow: "none",
          color: index < 7 ? "#059669" : "#065F46",
          duration: 0.2
        }, (index * 0.15) + 0.15);
      }
    });
    
    // After all letters are highlighted, pause briefly
    tl.to({}, { duration: 1 });
    
    // Then fade all letters back to dim state
    tl.to(lettersRef.current, {
      autoAlpha: 0.3,
      color: "#9CA3AF",
      scale: 1,
      textShadow: "none",
      duration: 0.5,
      stagger: 0.05,
      ease: "power2.inOut"
    });
    
    // Pause before repeating
    tl.to({}, { duration: 0.8 });
    
    return () => {
      tl.kill();
    };
  }, []);
  
  // Split "CalorieSensei" into individual letters for animation
  const text = "CalorieSensei";
  const letters = text.split("");
  
  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100"
    >
      <div ref={wrapperRef} className="text-center">
        <div className="flex justify-center items-center">
          {letters.map((letter, index) => (
            <span
              key={index}
              ref={addToRefs}
              className="text-6xl font-bold inline-block px-1"
            >
              {letter}
            </span>
          ))}
        </div>
      </div>
      
      {/* Spinner at the bottom, not rotated */}
      <div className="absolute bottom-16">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;