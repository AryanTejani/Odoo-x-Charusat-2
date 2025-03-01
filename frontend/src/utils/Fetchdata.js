import axios from "axios";

export const exerciseOptions = {
  method: "GET",
  headers: {
    "x-rapidapi-key": import.meta.env.VITE_RAPID_API_KEY, // For Vite
    "x-rapidapi-host": "exercisedb.p.rapidapi.com",
  },
};

export const youtubeOptions = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Host': 'youtube-search-and-download.p.rapidapi.com',
    'X-RapidAPI-Key': import.meta.env.VITE_RAPID_API_KEY,
  },
};


export const fetchData = async (URL, options) => {
  try {
    const response = await axios.get(URL, {
      ...options,
      withCredentials: false, // Ensure credentials aren't sent
    });
    return response.data;
  } catch (error) {
    console.error("Axios Error:", error.response?.data || error.message);
    return null;
  }
};