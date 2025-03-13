"use client"

import { Link } from "react-router-dom"
import { useEffect, useRef } from "react"
import gsap from "gsap"

const ExerciseCard = ({ exercise }) => {
  const cardRef = useRef(null)
  const imageRef = useRef(null)
  const titleRef = useRef(null)
  const tagsRef = useRef(null)

  useEffect(() => {
    // GSAP animations
    const card = cardRef.current

    // Initial state
    gsap.set(card, { y: 50, opacity: 0 })
    gsap.set(imageRef.current, { scale: 0.8, opacity: 0 })
    gsap.set(titleRef.current, { y: 20, opacity: 0 })
    gsap.set(tagsRef.current, { x: -20, opacity: 0 })

    // Animation timeline
    const tl = gsap.timeline({ paused: true })

    tl.to(card, {
      y: 0,
      opacity: 1,
      duration: 0.5,
      ease: "power3.out",
    })
      .to(
        imageRef.current,
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: "back.out(1.7)",
        },
        "-=0.3",
      )
      .to(
        titleRef.current,
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.4",
      )
      .to(
        tagsRef.current,
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.3",
      )

    // Play animation when component mounts
    tl.play()

    // Hover animations
    card.addEventListener("mouseenter", () => {
      gsap.to(imageRef.current, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out",
      })
      gsap.to(card, {
        boxShadow: "0 20px 25px -5px rgba(236, 72, 153, 0.1), 0 10px 10px -5px rgba(236, 72, 153, 0.04)",
        y: -5,
        duration: 0.3,
      })
    })

    card.addEventListener("mouseleave", () => {
      gsap.to(imageRef.current, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      })
      gsap.to(card, {
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
        y: 0,
        duration: 0.3,
      })
    })

    // Cleanup
    return () => {
      card.removeEventListener("mouseenter", () => {})
      card.removeEventListener("mouseleave", () => {})
    }
  }, [])

  return (
    <Link to={`/exercise/${exercise.id}`} className="block">
      <div
        ref={cardRef}
        className="exercise-card bg-gray-900 rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl border border-gray-800 group"
      >
        <div className="relative overflow-hidden h-64">
          <div ref={imageRef} className="w-full h-full flex items-center justify-center bg-gray-800">
            <img
              src={exercise.gifUrl || "/placeholder.svg"}
              alt={exercise.name}
              loading="lazy"
              className="object-cover w-full h-full"
            />
          </div>

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-40 group-hover:opacity-70 transition-opacity duration-300"></div>
          
          {/* Glow effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 to-purple-600/0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
        </div>

        <div className="p-5">
          <div ref={titleRef} className="mb-3">
            <h3 className="text-xl font-bold text-white capitalize group-hover:text-pink-400 transition-colors duration-300">
              {exercise.name}
            </h3>
          </div>

          <div ref={tagsRef} className="flex flex-wrap gap-2">
            <span className="px-3 py-1 text-sm font-medium text-white bg-pink-600 rounded-full shadow-lg shadow-pink-600/20">
              {exercise.bodyPart}
            </span>
            <span className="px-3 py-1 text-sm font-medium text-white bg-purple-600 rounded-full shadow-lg shadow-purple-600/20">
              {exercise.target}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ExerciseCard;
