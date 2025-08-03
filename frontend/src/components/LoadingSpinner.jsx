import { motion } from "framer-motion";

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003153] via-[#0a2239] to-[#1e2a38] flex items-center justify-center relative overflow-hidden">
      {/* Modern Glassy Spinner */}
      <motion.div
        className="w-20 h-20 rounded-full border-4 border-t-4 border-t-cyan-300 border-cyan-800 bg-gray-900/60 shadow-2xl backdrop-blur-lg"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <span className="absolute bottom-16 text-cyan-200 font-semibold text-lg tracking-wide animate-pulse">
        Loading...
      </span>
    </div>
  );
};

export default LoadingSpinner;
