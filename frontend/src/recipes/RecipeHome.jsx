// RecipeHome.jsx
import React from 'react';
import RecipeHero from './RecipeHero';
import CategoryWapper from './CategoryWrap';
import FeaturedSection from './FeaturedSection';
import LatestRecipe from './LatestRecipe';
import NewsLetter from './NewsLetter';

const RecipeHome = () => {
  return (
    <div className='w-full bg-white min-h-screen fixed top-0 left-0 right-0 bottom-0 overflow-y-auto'>
      <div className="container mx-auto">
        <div className='flex flex-col justify-center items-center w-full py-20'>
          <RecipeHero />
          <CategoryWapper />
          <FeaturedSection />
          <LatestRecipe />
          {/* <NewsLetter /> */}
        </div>
      </div>
    </div>
  );
};

export default RecipeHome;