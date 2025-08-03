import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchQuestions } from "../store/questionSlice";
import { fetchUserSubmissions } from "../store/submissionSlice";

const QuestionsListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    list: questions,
    status: qStatus,
    error,
  } = useSelector((state) => state.questions);
  const { list: submissions, status: sStatus } = useSelector(
    (state) => state.submissions
  );
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (qStatus === "idle") {
      dispatch(fetchQuestions());
    }
    if (sStatus === "idle" && user) {
      dispatch(fetchUserSubmissions());
    }
  }, [dispatch, qStatus, sStatus, user]);

  const questionStatuses = useMemo(() => {
    const statuses = new Map();
    if (!submissions || submissions.length === 0) return statuses;

    for (const sub of submissions) {
      const qId = sub.questionId?._id;
      if (!qId) continue;

      const currentStatus = statuses.get(qId);
      if (sub.status === "Accepted") {
        statuses.set(qId, "Solved");
      } else if (currentStatus !== "Solved") {
        statuses.set(qId, "Attempted");
      }
    }
    return statuses;
  }, [submissions]);

  const getStatusText = (questionId) => {
    const status = questionStatuses.get(questionId);
    if (status === "Solved")
      return <span className="text-green-400 font-bold">Solved</span>;
    if (status === "Attempted")
      return <span className="text-yellow-400 font-bold">Attempted</span>;
    return <span className="text-red-400 font-bold">Unsolved</span>;
  };

  if (qStatus === "loading")
    return <p className="text-center text-white">Loading questions...</p>;
  if (error)
    return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="w-full max-w-4xl mx-auto my-8 p-8 rounded-3xl shadow-2xl bg-gray-900/80 backdrop-blur-lg border border-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-teal-400">Questions</h2>
        {user?.isAdmin && (
          <Link
            to="/questions/create"
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded transition-colors"
          >
            Create New
          </Link>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full rounded-xl overflow-hidden shadow-lg bg-gray-900/70">
          <thead>
            <tr className="bg-gray-800/80">
              <th className="px-6 py-3 text-left text-sm font-semibold text-cyan-300 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-cyan-300 uppercase tracking-wider">Company</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-cyan-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {questions.length > 0 ? (
              questions.map((q) => (
                <tr
                  key={q._id}
                  className="border-b border-gray-700 hover:bg-gray-700/50"
                >
                  <td className="px-6 py-2 text-blue-400 font-semibold">
                    {q.title}
                  </td>
                  <td className="px-6 py-2 text-teal-300">
                    {q.company || "N/A"}
                  </td>
                  <td className="px-6 py-2">
                    {user ? getStatusText(q._id) : "-"}
                  </td>
                  <td className="px-6 py-2 text-right">
                    <button
                      onClick={() => navigate(`/questions/${q._id}`)}
                      className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-1 rounded transition"
                    >
                      Solve
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-6 text-gray-400">
                  No questions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuestionsListPage;