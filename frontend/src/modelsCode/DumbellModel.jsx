import React, { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { Leva, useControls } from "leva";
import Dumbell from "../../public/dumbell/Dumbell"; // ✅ Kept your import path
import CanvasLoader from "./CanvasLoader";

const DumbellModel = () => {
  // 🎛 Leva controls for real-time adjustments
  const { x, y, z } = useControls("Position", {
    x: { value: 0, min: -10, max: 10, step: 0.1 },
    y: { value: 0, min: -10, max: 10, step: 0.1 },
    z: { value: 0, min: -10, max: 10, step: 0.1 },
  });

  const { rotX, rotY, rotZ } = useControls("Rotation", {
    rotX: { value: 0, min: -Math.PI, max: Math.PI, step: 0.1 },
    rotY: { value: 0, min: -Math.PI, max: Math.PI, step: 0.1 },
    rotZ: { value: 0, min: -Math.PI, max: Math.PI, step: 0.1 },
  });

  const { scale } = useControls("Scale", {
    scale: { value: 1, min: 0.1, max: 5, step: 0.1 },
  });

  // Scroll animation state
  const [scrollY, setScrollY] = useState(0);

  // Floating effect state
  const [floatingY, setFloatingY] = useState(0);

  // Handle scroll event to update scrollY position
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY); // Capture the scroll position
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll); // Cleanup on unmount
  }, []);

  // Floating animation effect (sinusoidal motion)
  useEffect(() => {
    const animateFloating = () => {
      setFloatingY(Math.sin(Date.now() / 500) * 0.5); // Sinusoidal motion
      requestAnimationFrame(animateFloating);
    };

    animateFloating();
  }, []);

  return (
    <div className="w-full h-[500px] mt-20 bg-black">
      {/* <Leva collapsed={false} />  */}
      <Leva hidden/>{/* 🎛 Leva UI for controls */}
      <Canvas>
        {/* 🎥 Perspective Camera */}
        <PerspectiveCamera makeDefault position={[0, 1, 35]} />

        {/* 💡 Lighting */}
        <ambientLight intensity={3.6} />
        <directionalLight position={[10, 10, 10]} intensity={2} />

        {/* 🏗 Suspense with Loader */}
        <Suspense fallback={<CanvasLoader />}>
          {/* Apply floating effect to y-position and scroll animation */}
          <Dumbell
            position={[x, y + scrollY * 0.05 + floatingY, z]} // Apply both scroll and floating effect
            rotation={[-2.6, rotY, rotZ]}
            scale={1}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default DumbellModel;
