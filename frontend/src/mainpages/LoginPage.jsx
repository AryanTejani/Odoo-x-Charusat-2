import { motion } from "framer-motion";
import { Mail, Lock, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import gymboy from "../assets/gymboy8.jpg";
import { useState } from "react";

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

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/dashboard"); // Redirect to dashboard after successful login
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div
      className="relative mt-[50px] w-full flex items-center justify-center"
      style={{
        backgroundImage: `url(${gymboy})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-md px-8 py-10"
      >
        <div className="mb-10">
          <h2 className="text-white text-xl font-bold mb-1">START YOUR</h2>
          <h1 className="text-red-600 text-5xl font-extrabold mb-1">JOURNEY</h1>
          <div className="flex items-center">
            <h2 className="text-white text-xl font-bold">NOW</h2>
            <div className="ml-2 flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-3 bg-red-600 transform skew-x-12"
                ></div>
              ))}
            </div>
          </div>
        </div>

        <h3 className="text-white text-xl font-bold mb-6">Login Now</h3>

        <form onSubmit={handleLogin}>
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

          <div className="mb-2">
            <label className="block text-gray-400 mb-1">Password</label>
            <CustomInput
              icon={Lock}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex justify-end mb-6">
            <Link
              to="/forgot-password"
              className="text-sm text-gray-400 hover:text-white"
            >
              Forgot Password?
            </Link>
          </div>

          {error && <p className="text-red-500 font-medium mb-4">{error}</p>}

          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-3 px-4 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                "Login"
              )}
            </motion.button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Don't have an account?{" "}
            <Link to="/signup" className="text-white hover:text-red-400">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;