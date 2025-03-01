import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Mail, ArrowLeft, Loader } from "lucide-react";
import gym from "../assets/gymgirl10.jpg";

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

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { forgotPassword, isLoading, error, message } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await forgotPassword(email);
    setIsSubmitted(true);
  };

  return (
    <div
      className="relative mt-[50px] w-full flex items-center justify-center"
      style={{
        backgroundImage: `url(${gym})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
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
                <div key={i} className="w-2 h-3 bg-red-600 transform skew-x-12"></div>
              ))}
            </div>
          </div>
        </div>

        {!isSubmitted ? (
          <>
            <h3 className="text-white text-xl font-bold mb-6">Forgot Password</h3>
            <p className="text-gray-400 mb-6">
              Enter your email to receive a password reset link.
            </p>

            {message && (
              <div className="mb-6 p-3 bg-gray-800 bg-opacity-50 rounded-md border border-green-500">
                <p className="text-green-500">{message}</p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-3 bg-gray-800 bg-opacity-50 rounded-md border border-red-500">
                <p className="text-red-500">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <CustomInput
                icon={Mail}
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 bg-gradient-to-r from-red-500 to-red-700 text-white font-bold rounded-lg shadow-lg hover:from-red-600 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
                type="submit"
              >
                {isLoading ? <Loader className="size-6 animate-spin mx-auto" /> : "Send Reset Link"}
              </motion.button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Mail className="h-8 w-8 text-white" />
            </motion.div>
            <p className="text-gray-300 mb-6">
              If an account exists for <span className="text-white font-bold">{email}</span>, you will receive a password reset link shortly.
            </p>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-red-400 hover:underline flex items-center justify-center">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
