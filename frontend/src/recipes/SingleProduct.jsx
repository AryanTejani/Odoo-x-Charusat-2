import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
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

  if (loading) return <div className="text-center text-lg mt-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <section
      ref={containerRef}
      className="min-h-screen mt-[70px] md:flex justify-center items-center bg-white p-6"
    >
      <article className="max-w-3xl w-full bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="relative">
          <img
            src={item?.thumbnail_image}
            alt={`Photo of ${item?.name}`}
            className="w-full h-80 object-cover object-center rounded-t-xl"
          />
        </div>
        <div className="p-6 font-sans text-gray-800">
          <h1 className="text-4xl font-bold text-gray-900 fade-in">{item?.name}</h1>
          <p className="mt-4 text-lg fade-in">{item?.description || "A delightful dish for all occasions."}</p>
          <div className="mt-6 bg-gray-50 p-5 rounded-xl fade-in">
            <h2 className="text-xl font-semibold text-gray-700">Preparation Time</h2>
            <ul className="list-disc ml-6 mt-3 text-lg">
              <li>Total: {item?.more?.[0]?.total_time || "N/A"} minutes</li>
              <li>Prep: {item?.more?.[0]?.prep_time || "N/A"}</li>
              <li>Cook: {item?.more?.[0]?.cook_time || "N/A"}</li>
            </ul>
          </div>
          {item?.ingredients && (
            <div className="mt-6 fade-in">
              <h3 className="text-2xl font-bold text-gray-900">Ingredients</h3>
              <ul className="list-disc ml-6 mt-3 text-lg">
                {item.ingredients.map((ingredient, index) => (
                  <li key={index} className="mt-2">
                    {ingredient?.name}: {ingredient?.quantity}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-6 fade-in">
            <h3 className="text-2xl font-bold text-gray-900">Instructions</h3>
            <ol className="list-decimal ml-6 mt-3 text-lg">
              {item?.instructions?.split(/\s*\d+\.\s*/).filter(Boolean).map((step, index) => (
                <li key={index} className="mt-2">
                  {step.trim()}
                </li>
              ))}
            </ol>
          </div>
          {item?.tags && (
            <div className="mt-6 fade-in">
              <h3 className="text-2xl font-bold text-gray-900">Tags</h3>
              <div className="flex flex-wrap gap-2 mt-3">
                {item.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </section>
  );
};

export default SingleProduct;
