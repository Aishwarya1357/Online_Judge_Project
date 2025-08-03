

// import { motion } from "framer-motion";
// import { formatDate } from "../utils/date";
// import { useDispatch, useSelector } from "react-redux";
// import { logout } from "../store/authSlice"; // adjust path if needed
// import { useNavigate } from "react-router-dom";

// const DashboardPage = () => {
//   const user = useSelector((state) => state.auth.user);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate("/login");
//   };

//   const handleQuestions = () => {
//     navigate("/questions");
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, scale: 0.9 }}
//       animate={{ opacity: 1, scale: 1 }}
//       exit={{ opacity: 0, scale: 0.9 }}
//       transition={{ duration: 0.5 }}
//       className="w-full max-w-2xl mx-auto my-8 p-8 rounded-3xl shadow-2xl bg-gray-900/80 backdrop-blur-lg border border-gray-800"
//     >
//       <h1 className="text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-teal-400">
//         DASHBOARD
//       </h1>

//       <div className="space-y-6">
//         <motion.div
//           className="p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//         >
//           <h3 className="text-xl font-semibold text-[#68e5e5] mb-3">
//             Profile Information
//           </h3>
//           <p className="text-gray-300">Name: {user?.name}</p>
//           <p className="text-gray-300">Email: {user?.email}</p>
//         </motion.div>
//         <motion.div
//           className="p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.4 }}
//         >
//           <h3 className="text-xl font-semibold text-[#68e5e5] mb-3">
//             Account Activity
//           </h3>
//           <p className="text-gray-300">
//             <span className="font-bold">Joined: </span>
//             {user?.createdAt &&
//               new Date(user.createdAt).toLocaleDateString("en-US", {
//                 year: "numeric",
//                 month: "long",
//                 day: "numeric",
//               })}
//           </p>
//           <p className="text-gray-300">
//             <span className="font-bold">Last Login: </span>
//             {user?.lastLogin && formatDate(user.lastLogin)}
//           </p>
//         </motion.div>
//       </div>

//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.6 }}
//         className="mt-4"
//       >
//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={handleQuestions}
//           className="w-full py-3 px-4 bg-gradient-to-r from-[#68e5e5] to-[#098989] text-white mb-3 
//                         font-bold rounded-lg shadow-lg hover:from-[#098989]
//                         hover:to-[#098989] focus:outline-none focus:ring-2 focus:ring-[#68e5e5] focus:ring-offset-2
//                          focus:ring-offset-gray-900 transition duration-200"
//         >
//           Solve Questions
//         </motion.button>

//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={handleLogout}
//           className="w-full py-3 px-4 bg-gradient-to-r from-[#68e5e5] to-[#098989] text-white 
//                         font-bold rounded-lg shadow-lg hover:from-[#098989]
//                         hover:to-[#098989] focus:outline-none focus:ring-2 focus:ring-[#68e5e5] focus:ring-offset-2
//                          focus:ring-offset-gray-900 transition duration-200"
//         >
//           Logout
//         </motion.button>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default DashboardPage;

import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchUserSubmissions } from "../store/submissionSlice";
import { logout } from "../store/authSlice";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion"; // Import framer-motion

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { list: submissions, status } = useSelector(
    (state) => state.submissions
  );

  useEffect(() => {
    if (status === "idle" && user) {
      dispatch(fetchUserSubmissions());
    }
  }, [dispatch, status, user]);

  // Handlers for the new buttons
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  const handleQuestions = () => {
    navigate("/questions");
  };

  const stats = useMemo(() => {
    // ... (this calculation logic remains the same)
    if (!submissions || submissions.length === 0) {
      return {
        totalSolved: 0,
        totalAttempted: 0,
        accuracy: 0,
        verdictCounts: [],
        recentSubmissions: [],
      };
    }
    const solvedProblems = new Set();
    const attemptedProblems = new Set();
    const verdictMap = new Map();
    submissions.forEach((sub) => {
      attemptedProblems.add(sub.questionId?._id);
      if (sub.status === "Accepted") solvedProblems.add(sub.questionId?._id);
      verdictMap.set(sub.status, (verdictMap.get(sub.status) || 0) + 1);
    });
    const totalSubmissions = submissions.length;
    const acceptedSubmissions = verdictMap.get("Accepted") || 0;
    const accuracy =
      totalSubmissions > 0
        ? Math.round((acceptedSubmissions / totalSubmissions) * 100)
        : 0;
    const verdictCounts = Array.from(verdictMap.entries()).map(
      ([name, value]) => ({ name, value })
    );
    const recentSubmissions = submissions.slice(0, 5);
    return {
      totalSolved: solvedProblems.size,
      totalAttempted: attemptedProblems.size,
      accuracy,
      verdictCounts,
      recentSubmissions,
    };
  }, [submissions]);

  const COLORS = {
    Accepted: "#22c55e",
    "Wrong Answer": "#ef4444",
    "Compilation Error": "#f59e0b",
    "Time Limit Exceeded": "#f97316",
  };

  if (status === "loading") {
    return <p className="text-center text-white">Loading dashboard...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 text-white space-y-8">
      {/* --- NEW PROFILE SECTION --- */}
      <motion.div
        className="p-6 bg-gray-800 rounded-xl border border-gray-700"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-4">
          Welcome back, <span className="text-cyan-400">{user?.name}!</span>
        </h1>
        <div className="grid md:grid-cols-2 gap-6 mt-4">
          {/* Profile Info */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-cyan-400 mb-2">
              Profile Information
            </h3>
            <p className="text-gray-300">
              <strong>Name:</strong> {user?.name}
            </p>
            <p className="text-gray-300">
              <strong>Email:</strong> {user?.email}
            </p>
          </div>
          {/* Account Activity */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-cyan-400 mb-2">
              Account Activity
            </h3>
            <p className="text-gray-300">
              <strong>Joined:</strong>{" "}
              {user?.createdAt &&
                new Date(user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
            </p>
            <p className="text-gray-300">
              <strong>Last Login:</strong>{" "}
              {user?.lastLogin && new Date(user.lastLogin).toLocaleString()}
            </p>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleQuestions}
            className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-bold rounded-lg shadow-lg hover:shadow-cyan-500/50 transition duration-200"
          >
            Solve Questions
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="w-full py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg shadow-lg hover:shadow-red-500/50 transition duration-200"
          >
            Logout
          </motion.button>
        </div>
      </motion.div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-400">
            Problems Solved
          </h3>
          <p className="text-5xl font-bold text-green-400 mt-2">
            {stats.totalSolved}
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-400">
            Total Problems Attempted
          </h3>
          <p className="text-5xl font-bold text-yellow-400 mt-2">
            {stats.totalAttempted}
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-400">
            Submission Accuracy
          </h3>
          <p className="text-5xl font-bold text-cyan-400 mt-2">
            {stats.accuracy}%
          </p>
        </div>
      </div>

      {/* Charts and Recent Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h2 className="text-2xl font-bold mb-4">Submission Verdicts</h2>
          {submissions.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.verdictCounts}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {stats.verdictCounts.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[entry.name] || "#8884d8"}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              No submission data to display.
            </div>
          )}
        </div>
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
          <ul className="space-y-4">
            {stats.recentSubmissions.length > 0 ? (
              stats.recentSubmissions.map((sub) => (
                <li
                  key={sub._id}
                  className="flex justify-between items-center bg-gray-900 p-3 rounded-lg"
                >
                  <div>
                    <Link
                      to={`/questions/${sub.questionId?._id}`}
                      className="font-semibold hover:text-cyan-400 transition-colors"
                    >
                      {sub.questionId?.title || "Problem Deleted"}
                    </Link>
                    <p className="text-sm text-gray-400">
                      {new Date(sub.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`font-bold px-2 py-1 rounded-full text-xs ${
                      sub.status === "Accepted"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {sub.status}
                  </span>
                </li>
              ))
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                No recent submissions.
              </div>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;