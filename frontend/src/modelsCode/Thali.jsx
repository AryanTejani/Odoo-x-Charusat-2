import React, { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { Leva } from "leva";
import Thali from "../../public/thali/Thali"; // Make sure this path is correct
import CanvasLoader from "../modelsCode/CanvasLoader"; // If you have a loader component
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const RotatingPlate = () => {
  const plateRef = useRef();

  // Use useFrame to animate the floating effect (only y-axis movement)
  useFrame((state, delta) => {
    if (plateRef.current) {
      // Floating effect (up and down) using a sine wave
      plateRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.7 + 1.3; // Adjust amplitude for subtlety
    }
  });

  return (
    <mesh ref={plateRef} position={[-6.7, 1.3, -1.5]} scale={200} rotation={[1, 1.6, -0.1]}>
      <Thali />
    </mesh>
  );
};

const ThaliComponent = () => {
  const containerRef = useRef();

  useEffect(() => {
    // Scroll-triggered animation using GSAP
    gsap.fromTo(
      containerRef.current,
      {
        opacity: 0,
        y: 100,    // Start below the viewport
        rotation: 0, // Initial rotation to make it feel dynamic
      },
      {
        opacity: 1,
        y: 0,      // Move up to its original position
        rotation: 0, // Reset rotation
        duration: 1.5,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%", // When the top of the component reaches 80% of the viewport height
          end: "top 30%",   // When the top reaches 30% of the viewport height
          scrub: true, // Scrub the animation based on scroll
          markers: false, // Show scroll markers for debugging
        },
      }
    );
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-64 w-full flex justify-center items-center bg-gray-900"
    >
      <Leva hidden /> {/* Adds Leva UI controls */}
      <Canvas>
        {/* 🎥 Perspective Camera */}
        <PerspectiveCamera makeDefault position={[0, 1, 10]} />

        {/* 💡 Lighting */}
        <ambientLight intensity={3.6} />
        <directionalLight position={[10, 10, 10]} intensity={2} />

        {/* 🏗 Suspense with Loader */}
        <Suspense fallback={<CanvasLoader />}>
          <RotatingPlate />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ThaliComponent;

// position={[-6.7, 1.3, -1.5]}
//             scale={200} // Use the same scale for all axes
//             rotation={[1, 1.6, -0.1]}