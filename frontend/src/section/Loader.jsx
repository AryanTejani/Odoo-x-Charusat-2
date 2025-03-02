import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Loader = () => {
  const containerRef = useRef(null);
  const lettersRef = useRef([]);

  // Reset refs array for each letter
  lettersRef.current = [];

  // Add element to the refs array
  const addToRefs = (el) => {
    if (el && !lettersRef.current.includes(el)) {
      lettersRef.current.push(el);
    }
  };

  useEffect(() => {
    // Create the loading animation
    const tl = gsap.timeline({ repeat: -1 });
    
    // First hide all letters
    gsap.set(lettersRef.current, { autoAlpha: 0 });
    
    // Then animate each letter sequentially
    lettersRef.current.forEach((letter, index) => {
      tl.to(letter, {
        autoAlpha: 1,
        duration: 0.2,
        ease: "power2.inOut"
      }, index * 0.1);
    });
    
    // After all letters are visible, pause briefly
    tl.to({}, { duration: 0.5 });
    
    // Then fade all letters out
    tl.to(lettersRef.current, {
      autoAlpha: 0,
      duration: 0.5,
      stagger: 0.05,
      ease: "power2.inOut"
    });
    
    // Pause before repeating
    tl.to({}, { duration: 0.5 });
    
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
      className="fixed inset-0 flex items-center justify-center bg-gradient-to-r from-green-50 to-green-100"
    >
      <div className="text-center">
        <div className="flex justify-center items-center">
          {letters.map((letter, index) => (
            <span
              key={index}
              ref={addToRefs}
              className={`text-5xl font-bold inline-block ${
                index < 7 ? 'text-green-600' : 'text-green-800'
              }`}
            >
              {letter}
            </span>
          ))}
        </div>
        <div className="mt-4">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;