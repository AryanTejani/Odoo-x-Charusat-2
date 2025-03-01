import { useState } from "react";
import { uploadImage } from "../utils/fetchApi.js";
import { motion } from "framer-motion";
import chakra1 from "../assets/chakra1.jpg";
import chakra2 from "../assets/chakra2.jpg";
import chakra3 from "../assets/chakra3.jpg";
import chakra4 from "../assets/chakra4.jpg";

const ImageUpload = ({ onUploadSuccess }) => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // Generate preview URL
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!image) {
      setError("Please select an image first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await uploadImage(image);
      onUploadSuccess(data.data);
    } catch (error) {
      console.error("Upload failed", error);
      setError("Upload failed. Please try again.");
    }

    setLoading(false);
  };

  // Sample images for the horizontal scrolling section
  const images = [
    chakra1,chakra2,chakra3,chakra4
  ];

  return (
    <div className="pt-28 min-h-screen flex flex-col items-center justify-center bg-black text-white font-sans relative">
      {/* Background Image */}
      <div className="absolute inset-0 bg-[url('/your-background-image.jpg')] bg-cover bg-center opacity-30"></div>

      {/* Upload Box */}
      <div className="relative p-6 bg-gray-800/80 shadow-xl backdrop-blur-md rounded-2xl w-full max-w-md text-center border border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-gray-200">Upload Your Food Image</h2>

        {/* File Selector */}
        <label className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg inline-block transition duration-300">
          Select Image
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>

        {/* Image Preview */}
        {preview && (
          <div className="mt-4">
            <img src={preview} alt="Preview" className="w-full h-40 object-cover rounded-lg border border-gray-600 shadow-md" />
          </div>
        )}

        {/* Error Message */}
        {error && <p className="text-red-400 mt-3">{error}</p>}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg shadow-lg transition duration-300 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Image"}
        </button>
      </div>
        {/* <History/> */}
      {/* Horizontal Scrolling Images */}
      <div className="w-full overflow-hidden mt-20">
        <motion.div
          className="flex space-x-6"
          initial={{ x: 0 }}
          animate={{ x: ["0%", "-100%"] }}
          transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
        >
          {[...images, ...images].map((src, index) => (
            <img key={index} src={src} alt={`Food ${index}`} className="h-[250px] w-auto rounded-lg shadow-lg" />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ImageUpload;
