import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";
import {
  fetchSubmissionById,
  clearSelectedSubmission,
} from "../store/submissionSlice";
import EditorComponent from "../components/EditorComponent"; // We'll reuse the editor component

const SubmissionDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const {
    selectedSubmission: submission,
    detailStatus: status,
    error,
  } = useSelector((state) => state.submissions);

  useEffect(() => {
    if (id) {
      dispatch(fetchSubmissionById(id));
    }
    // Cleanup function to clear the data when we leave the page
    return () => {
      dispatch(clearSelectedSubmission());
    };
  }, [dispatch, id]);

  const getStatusColor = (status) => {
    if (status === "Accepted") return "text-green-400";
    if (status === "Wrong Answer") return "text-red-400";
    return "text-yellow-400";
  };

  if (status === "loading" || status === "idle")
    return (
      <p className="text-center text-white">Loading submission details...</p>
    );
  if (status === "failed")
    return <p className="text-center text-red-500">Error: {error}</p>;
  if (!submission)
    return <p className="text-center text-white">Submission not found.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 text-white space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-cyan-300">
          Submission for{" "}
          <Link
            to={`/questions/${submission.questionId._id}`}
            className="hover:underline"
          >
            {submission.questionId.title}
          </Link>
        </h1>
        <p className="text-gray-400">
          Submitted on {new Date(submission.createdAt).toLocaleString()}
        </p>
      </div>

      <div className="bg-gray-800 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-2">Result</h2>
        <p
          className={`text-2xl font-bold ${getStatusColor(submission.status)}`}
        >
          {submission.status}
        </p>
      </div>

      {submission.status !== "Accepted" && (
        <div className="bg-gray-800 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-2">Output / Error Details</h2>
          <pre className="bg-gray-900 p-4 rounded text-red-400 whitespace-pre-wrap font-mono text-sm">
            {submission.output}
          </pre>
        </div>
      )}

      <div className="bg-gray-800 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-2">
          Submitted Code ({submission.language})
        </h2>
        <div className="border border-gray-700 rounded-lg overflow-hidden">
          <EditorComponent
            language={submission.language}
            value={submission.code}
            options={{ readOnly: true, domReadOnly: true }} // Make the editor read-only
          />
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetailPage;
