import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useAuthStore } from "../store/authStore";
import gym from "../assets/gymgirl10.jpg"
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

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { signup, error, isLoading } = useAuthStore();

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      await signup(email, password, name);
      navigate("/verify-email");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div 
      className="relative mt-[50px] w-full flex items-center justify-center" 
      style={{
        backgroundImage: `url(${gym})`,// Replace with your actual image path
        backgroundSize: "cover",
        // backgroundPosition: "center",
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

        <h3 className="text-white text-xl font-bold mb-6">Create Account</h3>

        <form onSubmit={handleSignUp}>
          <div className="mb-4">
            <label className="block text-gray-400 mb-1">User Name</label>
            <CustomInput
              icon={User}
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (/^\d+$/.test(inputValue)) {
                  // Prevent setting purely numeric values
                  return;
                }
                setName(inputValue);
              }}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-400 mb-1">Email</label>
            <CustomInput
              icon={Mail}
              type="email"
              placeholder="johndoe@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-400 mb-1">Password</label>
            <CustomInput
              icon={Lock}
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <PasswordStrengthMeter password={password} />

          {error && <p className="text-red-500 font-medium my-4">{error}</p>}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-6 py-3 px-4 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="w-5 h-5 animate-spin mx-auto" />
            ) : (
              "Create Account"
            )}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-white hover:text-red-400">
              Login
            </Link>
          </p>
        </div>
    
      </motion.div>
    </div>
  );
};

export default SignUpPage;