import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SingleProduct = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/item/items/${id}`
        );
        setItem(response.data);
      } catch (err) {
        setError("Failed to fetch product data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (item) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );

      gsap.utils.toArray(".fade-in").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
            },
          }
        );
      });
    }
  }, [item]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );
  
  if (error) return (
    <div className="text-center text-red-500 mt-20 p-6">
      <div className="text-2xl font-bold mb-2">Error</div>
      <p>{error}</p>
    </div>
  );

  return (
    <section
      ref={containerRef}
      className="min-h-screen mt-[70px] bg-gray-50 py-10 px-4"
    >
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Link to="/recipe" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to recipes
        </Link>
        
        <article className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Hero image section */}
          <div className="relative h-96">
            <img
              src={item?.thumbnail_image}
              alt={`Photo of ${item?.name}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <div className="inline-block px-3 py-1 bg-amber-500 text-white text-sm font-semibold rounded-lg mb-3">{item?.category}</div>
              <h1 className="text-4xl font-bold mb-2">{item?.name}</h1>
              <div className="flex items-center space-x-4 text-sm">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {item?.more?.prep_time} prep • {item?.more?.cook_time} cook
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                  Serves {item?.more?.servings}
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  {item?.more?.difficulty}
                </span>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="p-8 font-sans text-gray-800">
            {/* Description */}
            <p className="text-lg text-gray-700 border-b border-gray-100 pb-6 fade-in">
              {item?.description || "A delightful dish for all occasions."}
            </p>
            
            {/* Nutrition info */}
            <div className="mt-8 fade-in">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Nutrition Information</h2>
              <div className="grid grid-cols-4 gap-4 bg-amber-50 rounded-xl p-5">
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">{item?.calories}</div>
                  <div className="text-sm text-gray-600">Calories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">{item?.protein}g</div>
                  <div className="text-sm text-gray-600">Protein</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">{item?.carbs}g</div>
                  <div className="text-sm text-gray-600">Carbs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">{item?.fat}g</div>
                  <div className="text-sm text-gray-600">Fat</div>
                </div>
              </div>
            </div>
            
            {/* Two column layout for ingredients and instructions */}
            <div className="mt-8 grid md:grid-cols-2 gap-8">
              {/* Ingredients */}
              <div className="fade-in">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Ingredients</h2>
                <div className="bg-gray-50 rounded-xl p-5">
                  <ul className="space-y-3">
                    {item?.ingredients?.map((ingredient, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3"></span>
                        <span className="flex-1">
                          <span className="font-medium">{ingredient?.name}:</span> {ingredient?.quantity}
                          {ingredient?.optional && <span className="text-gray-500 italic ml-1">(optional)</span>}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Instructions */}
              <div className="fade-in">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Instructions</h2>
                <div className="space-y-4">
                  {item?.instructions?.split(/\s*\d+\.\s*/).filter(Boolean).map((step, index) => (
                    <div key={index} className="flex">
                      <div className="flex-shrink-0 w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center mr-3 mt-1">
                        {index + 1}
                      </div>
                      <p className="flex-1">{step.trim()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Source and youtube link */}
            <div className="mt-8 fade-in">
              {item?.more?.source && (
                <div className="mb-4">
                  <span className="text-gray-600">Source: </span>
                  <span className="text-amber-600">{item?.more?.source}</span>
                </div>
              )}
              
              {item?.youtube_link && (
                <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${item?.youtube_link.split('v=')[1]}`}
                    title="Recipe video"
                    allowFullScreen
                    className="w-full h-full rounded-xl"
                  ></iframe>
                </div>
              )}
            </div>
            
            {/* Tags */}
            {item?.tags && (
              <div className="mt-8 fade-in">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Comments */}
            {item?.comments && item.comments.length > 0 && (
              <div className="mt-12 fade-in">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Comments</h3>
                <div className="space-y-6">
                  {item.comments.map((comment, index) => (
                    <div key={index} className="bg-gray-50 p-5 rounded-xl">
                      <div className="font-semibold text-gray-900 mb-2">{comment.user}</div>
                      <p className="text-gray-700">{comment.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    </section>
  );
};

export default SingleProduct;