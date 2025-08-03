import React from "react";
import Navbar from "./Navbar";
import { Toaster } from "react-hot-toast"; // 1. IMPORT

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* 2. ADD THE TOASTER COMPONENT HERE */}
      <Toaster
        position="top-center"
        toastOptions={{
          // Define default options
          className: "",
          style: {
            background: "#333",
            color: "#fff",
            border: "1px solid #555",
          },
          // Default options for specific types
          success: {
            duration: 3000,
          },
          error: {
            duration: 5000,
          },
        }}
      />
      <Navbar />
      <main className="p-4">{children}</main>
    </div>
  );
};

export default Layout;
