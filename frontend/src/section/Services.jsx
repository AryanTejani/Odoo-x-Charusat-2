import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ThaliComponent from "../modelsCode/Thali";
import imgGirl from "../assets/gymgirl5.jpg";
import imgboy from "../assets/gymboy4.jpg";
import imggirl2 from "../assets/gymgirl9.jpg";
import imgboy2 from "../assets/gymboy3.jpg";
import cardio2 from "../assets/cardio2.jpg";
import imgboy3 from "../assets/gymboy9.jpg"
gsap.registerPlugin(ScrollTrigger);

const services = [
  { title: "Strength Training", img: imgboy },
  { title: "Endurance Training", img: imgGirl },
  { title: "Muscle Building", img: imgboy3 },
  { title: "Cardio Workouts", img: cardio2 },
];

const ServicesSection = () => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const headingRef = useRef(null);
  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { scale: 0.1, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 1,
          toggleActions: "play reverse play reverse",
        },
      }
    );
  }, []);

  useEffect(() => {
    gsap.fromTo(
      headingRef.current,
      { scale: 0.8, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 80%", // Adjust this value as needed
          end: "bottom 20%", // Adjust this value as needed
          toggleActions: "play none none reset", // Reset the animation when scrolling back
        },
      }
    );
  }, []);
  return (
    <section ref={sectionRef} className="py-20 bg-black text-white">
      {/* Title */}
      <h2 className="text-5xl font-bold text-center mb-12" ref={headingRef}>
        Our <span className="text-cyan-500 font-extrabold">Services</span>
      </h2>

      {/* Service Cards Container */}
      <div
        ref={containerRef}
        className="flex flex-wrap gap-4 justify-center transition-transform duration-40"
      >
        {/* First Service (No Image) */}
        <div className="relative group p-4 w-[33%] rounded-lg overflow-hidden border border-cyan-500 bg-gray-900 transition-all duration-300 hover:scale-105 hover:border-cyan-300">
          <h3 className="text-xl font-semibold text-white mb-4 text-center">
            Physical Fitness
          </h3>
          <img
            src={imggirl2}
            alt="Physical Fitness"
            className="w-full h-[250px] object-cover rounded-md"
          />
        </div>

        {/* Second Service (3D Model) */}
        <div className="relative p-4 w-[32%] rounded-lg border border-cyan-500 bg-gray-900 text-center transition-all duration-300 hover:scale-105 hover:border-cyan-300">
          <h3 className="text-xl font-semibold text-white mb-4">
            Chakra Tracking
          </h3>
          <ThaliComponent />
        </div>

        {/* Remaining Services (Images) */}
        {services.map((service, index) => (
          <div
            key={index}
            className="relative group p-4 w-[32%] rounded-lg overflow-hidden border border-cyan-500 bg-gray-900 transition-all duration-300 hover:scale-105 hover:border-cyan-300"
          >
            <h3 className="text-xl font-semibold text-white text-center mb-4">
              {service.title}
            </h3>
            <img
              src={service.img}
              alt={service.title}
              className="w-full h-[250px] object-cover rounded-md"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;
