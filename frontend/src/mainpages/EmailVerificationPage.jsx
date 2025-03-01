import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";
import gym from "../assets/gymboy7.jpg";
const EmailVerificationPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const { error, isLoading, verifyEmail } = useAuthStore();

  const handleChange = (index, value) => {
    const newCode = [...code];

    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex].focus();
    } else {
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("");
    try {
      await verifyEmail(verificationCode);
      navigate("/goal-selection");
      toast.success("Email verified successfully");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSubmit(new Event("submit"));
    }
  }, [code]);

  return (
    <div
      className="relative mt-[50px] w-full flex items-center justify-center"
      style={{
        backgroundImage: `url(${gym})`,
        backgroundSize: "cover",
        // backgroundPosition: "center",
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

        <h3 className="text-white text-xl font-bold mb-2">Verify Your Email</h3>
        <p className="text-gray-400 mb-6">
          Enter the 6-digit code sent to your email address.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-2xl font-bold bg-gray-800 bg-opacity-50 text-white border border-gray-700 rounded-md focus:border-red-500 focus:outline-none"
              />
            ))}
          </div>

          {error && <p className="text-red-500 font-medium mt-2">{error}</p>}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading || code.some((digit) => !digit)}
            className="w-full py-3 px-4 bg-gradient-to-r from-red-500 to-red-700 text-white font-bold rounded-lg shadow-lg hover:from-red-600 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200 disabled:opacity-50"
          >
            {isLoading ? <Loader className="size-6 animate-spin mx-auto" /> : "Verify Email"}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Didn't receive the code?{" "}
            <span className="text-red-400 cursor-pointer hover:underline">Resend</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default EmailVerificationPage;
