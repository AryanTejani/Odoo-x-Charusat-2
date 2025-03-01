import React, { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { Leva, useControls } from "leva";
import CanvasLoader from "./CanvasLoader";
import GymMul from "../../public/gym_multiple/Gym_multiple";

const AnimatedModel = () => {
  const modelRef = useRef();
  const [scrollY, setScrollY] = useState(0);

  // 🔄 Scroll Event Listener for Rotation
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔄 Animate Floating & Rotation
  useFrame(() => {
    if (modelRef.current) {
      // Floating effect using sine wave
      modelRef.current.position.y = Math.sin(Date.now() * 0.005) * 0.5 - 6.8; // Floating up and down

      // Rotation effect based on scroll position
      modelRef.current.rotation.y = -1.7 + scrollY * 0.002; // Rotate based on scroll
    }
  });

  return (
    <group ref={modelRef} position={[-3.2, -9.9, -46.8]} rotation={[0, -1.8, -0.4]} scale={0.5}>
      <GymMul />
    </group>
  );
};

const MachineGym = () => {
  const { camPos, lightIntensity } = useControls({
    camPos: { value: [0, 0, 30], step: 1 },
    lightIntensity: { value: 1, min: 0, max: 5, step: 0.1 },
  });

  return (
    <div className="w-full h-[500px] mt-20 bg-black">
      <Canvas>
        <Leva hidden />
        {/* 🎥 Camera without Orbit Controls */}
        <PerspectiveCamera makeDefault position={[0, 1, 35]} />

        {/* 💡 Lighting */}
        <ambientLight intensity={3.6} />
        <directionalLight position={[10, 10, 10]} intensity={lightIntensity} />

        {/* 🏗 Suspense with Loader */}
        <Suspense fallback={<CanvasLoader />}>
          <AnimatedModel />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default MachineGym;
