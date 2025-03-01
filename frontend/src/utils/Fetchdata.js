import axios from "axios";

export const exerciseOptions = {
  method: "GET",
  headers: {
    "x-rapidapi-key": "0eefa0c31bmsh7253a32531f0adbp1f3e4fjsndadc7712f66e", // For Vite
    "x-rapidapi-host": "exercisedb.p.rapidapi.com",
  },
};

export const youtubeOptions = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Host': 'youtube-search-and-download.p.rapidapi.com',
    'X-RapidAPI-Key': '0eefa0c31bmsh7253a32531f0adbp1f3e4fjsndadc7712f66e',
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