import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserSubmissions } from "../store/submissionSlice";
import { Link } from "react-router-dom";

const SubmissionsPage = () => {
  const dispatch = useDispatch();
  const {
    list: submissions,
    status,
    error,
  } = useSelector((state) => state.submissions);

  useEffect(() => {
    dispatch(fetchUserSubmissions());
  }, [dispatch]);

  const getStatusColor = (status) => {
    if (status === "Accepted") return "text-green-400";
    if (status === "Wrong Answer") return "text-red-400";
    return "text-yellow-400";
  };

  if (status === "loading")
    return <p className="text-center text-white">Loading submissions...</p>;
  if (status === "failed")
    return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="w-full max-w-5xl mx-auto my-8 p-8 rounded-3xl shadow-2xl bg-gray-900/80 backdrop-blur-lg border border-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-teal-400">
        My Submissions
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full rounded-xl overflow-hidden shadow-lg bg-gray-900/70">
          <thead>
            <tr className="bg-gray-800/80">
              <th className="px-6 py-3 text-left text-sm font-semibold text-cyan-300 uppercase tracking-wider">
                Problem
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-cyan-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-cyan-300 uppercase tracking-wider">
                Language
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-cyan-300 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {submissions.length > 0 ? (
              submissions.map((sub) => (
                <tr key={sub._id} className="border-b border-gray-700">
                  <td className="px-6 py-2 text-teal-200 font-medium">
                    <Link
                      to={`/questions/${sub.questionId?._id}`}
                      className="hover:underline"
                    >
                      {sub.questionId?.title || "Problem Deleted"}
                    </Link>
                  </td>
                  <td className="px-6 py-2">
                    <span className={`font-bold ${getStatusColor(sub.status)}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-2 text-gray-400">{sub.language}</td>
                  <td className="px-6 py-2 text-gray-400">
                    {new Date(sub.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-2 text-right">
                    {/* --- ADDED VIEW BUTTON --- */}
                    <Link
                      to={`/submissions/${sub._id}`}
                      className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-1 rounded-md text-sm font-semibold transition"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-6 text-gray-400">
                  No submissions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubmissionsPage;
