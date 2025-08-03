import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader } from "lucide-react";
import Input from "../components/Input";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/authSlice";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";

const LoginPage = () => {
  const [animationData, setAnimationData] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await dispatch(login({ email, password })).unwrap();
    } catch {}
  };

  useEffect(() => {
    fetch("/animations/Codingboy.json")
      .then((res) => res.json())
      .then(setAnimationData)
      .catch(console.error);
  }, []);

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
          {animationData && <Lottie animationData={animationData} loop={true} />}
        </div>

        {/* Login Form on the Right */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-teal-500">
            Welcome Back
          </h2>
          <form onSubmit={handleLogin}>
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
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <motion.button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-cyan-900 to-teal-300 text-white font-bold rounded-lg shadow-lg"
              disabled={status === "loading"}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {status === "loading" ? (
                <Loader className="animate-spin mx-auto" size={24} />
              ) : (
                "Login"
              )}
            </motion.button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{" "}
              <Link to="/signup" className="text-cyan-300 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;

