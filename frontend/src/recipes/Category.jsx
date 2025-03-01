import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Card from './Card';
import CategoryWrapper from './CategoryWrap';

const Category = () => {
  const { category } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/categories/${category}`);
        setItems(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Error fetching data');
      } 
    };

    fetchCategoryData();
  }, [category]);


  return (
    <div className='w-full bg-white min-h-screen fixed top-0 left-0 right-0 bottom-0 overflow-y-auto'>
    <h1 className='text-center text-3xl py-10  font-semibold text-secondary sm:text-6xl sm:leading-relaxed'>{category.charAt(0).toUpperCase() + category.slice(1)}</h1>
    <CategoryWrapper />
    <ul className=' mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
      {items.map(item => (
        <Card key={item._id} item={item}/>
      ))}
    </ul>
  </div>
  );
};

export default Category;
