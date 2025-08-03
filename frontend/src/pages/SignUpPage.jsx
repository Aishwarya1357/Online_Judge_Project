import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, Loader } from "lucide-react";
import Input from "../components/Input.jsx";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter.jsx";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../store/authSlice.js";
import { useNavigate, Link } from "react-router-dom";
import Lottie from "lottie-react";

const SignUpPage = () => {
  const [animationData, setAnimationData] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  useEffect(() => {
    fetch("/animations/Codingboy.json")
      .then((res) => res.json())
      .then(setAnimationData)
      .catch(console.error);
  }, []);

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await dispatch(signup({ email, password, name, adminCode })).unwrap();
      navigate("/");
    } catch {}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#003153] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex w-full max-w-5xl bg-gray-800 bg-opacity-80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Lottie Animation on the Left */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-gray-900">
          {animationData && <Lottie animationData={animationData} loop={true} style={{ height: 350 }} />}
        </div>

        {/* Signup Form on the Right */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-teal-500">
            Create Account
          </h2>
          <form onSubmit={handleSignUp}>
            <Input
              icon={User}
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              icon={Mail}
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              icon={Lock}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              icon={Lock}
              type="text"
              placeholder="Admin Code (optional)"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
            />
            {error && (
              <p className="text-red-500 font-semibold mt-2">{error}</p>
            )}
            <PasswordStrengthMeter password={password} />
            <motion.button
              type="submit"
              className="mt-5 w-full py-3 bg-gradient-to-r from-cyan-300 to-teal-500 text-white font-bold rounded-lg shadow-lg"
              disabled={status === "loading"}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {status === "loading" ? (
                <Loader className="animate-spin mx-auto" size={24} />
              ) : (
                "Sign Up"
              )}
            </motion.button>
          </form>
          <div className="mt-4 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-cyan-300 hover:underline">
              Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
