import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { useNavigate, useParams } from "react-router-dom";
import { Lock, Loader } from "lucide-react";
import toast from "react-hot-toast";

// Custom input component with translucent background
const CustomInput = ({ icon: Icon, ...props }) => (
  <div className="relative mb-4">
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      <Icon className="h-5 w-5 text-gray-400" />
    </div>
    <input
      className="w-full py-3 pl-10 pr-4 bg-gray-800 bg-opacity-50 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
      {...props}
    />
  </div>
);

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { resetPassword, error, isLoading, message } = useAuthStore();

  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    
    try {
      await resetPassword(token, password);

      toast.success("Password reset successfully, redirecting to login page...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error resetting password");
    }
  };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center" 
      style={{
        backgroundImage: "url('/images/fitness-background.jpg')", // Replace with your actual image path
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-md px-8 py-10"
      >
        {/* Red corner logo */}
        <div className="absolute top-0 left-0 p-5">
          <div className="text-white text-xl font-bold">Logo</div>
        </div>

        {/* Journey Text */}
        <div className="mb-10">
          <h2 className="text-white text-xl font-bold mb-1">START YOUR</h2>
          <h1 className="text-red-600 text-5xl font-extrabold mb-1">JOURNEY</h1>
          <div className="flex items-center">
            <h2 className="text-white text-xl font-bold">NOW</h2>
            <div className="ml-2 flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-2 h-3 bg-red-600 transform skew-x-12"></div>
              ))}
            </div>
          </div>
        </div>

        <h3 className="text-white text-xl font-bold mb-2">Reset Password</h3>
        <p className="text-gray-400 mb-6">
          Enter your new password below.
        </p>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {message && <p className="text-green-500 text-sm mb-4">{message}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-400 mb-1">New Password</label>
            <CustomInput
              icon={Lock}
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-400 mb-1">Confirm Password</label>
            <CustomInput
              icon={Lock}
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-4 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="w-5 h-5 animate-spin mx-auto" />
            ) : (
              "Set New Password"
            )}
          </motion.button>
        </form>

        {/* Red chevrons in bottom left corner */}
        <div className="absolute bottom-5 left-5">
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-2 h-3 bg-red-600 transform skew-x-12"></div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;