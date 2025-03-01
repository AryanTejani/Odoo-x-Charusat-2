import axios from "axios";

export const exerciseOptions = {
  method: "GET",
  headers: {
    "x-rapidapi-key": "11c3c32bcamsh33ee80e98eb241ep1ab6c4jsn0b16cd2139c4", // For Vite
    "x-rapidapi-host": "exercisedb.p.rapidapi.com",
  },
};

export const youtubeOptions = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Host': 'youtube-search-and-download.p.rapidapi.com',
    'X-RapidAPI-Key': '11c3c32bcamsh33ee80e98eb241ep1ab6c4jsn0b16cd2139c4',
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