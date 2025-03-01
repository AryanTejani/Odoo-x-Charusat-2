import React from "react";
import featuredImg from "../assets/featured.webp";

const FeaturedSection = () => {
  return (
    <div className="overflow-hidden flex md:flex-row flex-col justify-between items-center sm:my-20 my-4 md:gap-20 gap-12 px-5 xl:px-10">
      {/* Image Section */}
      <div className="relative w-full md:w-1/2">
        {/* Featured Recipe Label */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-md uppercase tracking-wider text-sm font-semibold">
          Featured Recipe
        </div>
        <img src={featuredImg} className="rounded-lg w-full object-cover" />
      </div>

      {/* Text Content */}
      <div className="text-start sm:w-1/2">
        <h2 className="text-3xl font-bold text-secondary sm:text-5xl sm:leading-relaxed">
          Pineapple + Smoked Jackfruit Pizza
        </h2>
        <p className="text-lg mt-4 text-gray-600">
          Lorem ipsum dolor sit amet consectetur. Praesent mattis nibh
          vestibulum euismod morbi ullamcorper rutrum. Orci cras in phasellus
          ultricies.
        </p>
        <div className="lg:mt-0 lg:flex-shrink-0">
          <div className="mt-12 inline-flex">
            <button
              type="button"
              className="py-4 px-8 bg-yellow-600 text-white hover:bg-yellow-700 transition ease-in duration-200 text-center text-lg font-semibold border border-yellow-700 focus:outline-none rounded-lg shadow-md"
            >
              View Recipe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedSection;
