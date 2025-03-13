// Button.jsx
import React, { useRef, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import { gsap } from "gsap";

const Button = ({
  text,
  isLoading,
  isDisabled,
  rightIcon,
  leftIcon,
  type = "primary",
  onClick,
  flex,
  small,
  outlined,
  full,
}) => {
  const buttonRef = useRef(null);

  useEffect(() => {
    if (buttonRef.current) {
      gsap.from(buttonRef.current, {
        scale: 0.95,
        opacity: 0.8,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  }, []);

  // Base classes
  const baseClasses = "rounded-lg text-white text-sm cursor-pointer transition-all flex items-center justify-center gap-1.5";
  
  // Size classes
  const sizeClasses = small ? "py-2.5 px-7 text-xs" : "py-4 px-6.5 sm:py-2 sm:px-3";
  
  // Type classes
  const typeClasses = type === "secondary" 
    ? "bg-secondary border border-secondary" 
    : "bg-primary border border-primary shadow-lg shadow-primary/40";
  
  // State classes
  const stateClasses = (isDisabled || isLoading) ? "opacity-80 cursor-not-allowed" : "hover:brightness-105 active:scale-[0.98]";
  
  // Layout classes
  const layoutClasses = [
    flex ? "flex-1" : "",
    full ? "w-full" : "",
    outlined ? "bg-transparent text-primary shadow-none" : ""
  ].join(" ");

  return (
    <div
      ref={buttonRef}
      className={`${baseClasses} ${sizeClasses} ${typeClasses} ${stateClasses} ${layoutClasses}`}
      onClick={() => !isDisabled && !isLoading && onClick()}
    >
      {isLoading && (
        <CircularProgress
          style={{ width: "18px", height: "18px", color: "inherit" }}
        />
      )}
      {leftIcon}
      {text}
      {isLoading && <span>. . .</span>}
      {rightIcon}
    </div>
  );
};

export default Button;
