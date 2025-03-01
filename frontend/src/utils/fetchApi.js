import axios from "axios";

const NODE_API_URL = "http://localhost:5000/api/tracker/detect"; // Node.js API for detecting food
const HISTORY_API_URL = "http://localhost:5000/api/tracker/history"; // Node.js API for fetching history

// Upload image to Node.js backend (which will forward it to Flask)
export const uploadImage = async (image) => {
  console.log("📤 Sending image to Node.js API...");

  const formData = new FormData();
  formData.append("image", image);

  try {
    const response = await axios.post(NODE_API_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });

    console.log("✅ Node.js Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Upload failed:", error);
    throw error;
  }
};

// Fetch food history from MongoDB (Node.js Backend)
export const fetchHistory = async () => {
  try {
    const response = await axios.get(HISTORY_API_URL, { withCredentials: true });
    console.log("📜 Retrieved Food History:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Fetch history failed:", error);
    throw error;
  }
};

export const fetchHealthdata = async()=>{
  try {
    const response = await axios.get("http://localhost:5000/api/health/gethealth", { withCredentials: true });
    console.log("📜 Retrieved Food History:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Fetch Health Data failed:", error);
    throw error;
  }
}
