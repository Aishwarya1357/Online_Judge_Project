import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
// --- UPDATED IMPORTS ---
import {
  fetchQuestionById,
  updateQuestion,
  clearSelectedQuestion,
} from "../store/questionSlice";

const fields = [
  { name: "qid", label: "Question ID (e.g., 'two-sum')", type: "text" },
  { name: "title", label: "Title", type: "text" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "sampleInput", label: "Sample Input", type: "textarea" },
  { name: "sampleOutput", label: "Sample Output", type: "textarea" },
  { name: "constraints", label: "Constraints", type: "textarea" },
  { name: "company", label: "Company", type: "text" },
];

const UpdateQuestionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // --- UPDATED SELECTORS ---
  const {
    selectedQuestion,
    detailStatus: status,
    error,
  } = useSelector((state) => state.questions);

  const [form, setForm] = useState(null);
  const [testCases, setTestCases] = useState([]);

  // --- UPDATED useEffect ---
  useEffect(() => {
    // Fetch only the single question needed for this page
    if (id) {
      dispatch(fetchQuestionById(id));
    }
    // Cleanup function to clear data when leaving the page
    return () => {
      dispatch(clearSelectedQuestion());
    };
  }, [dispatch, id]);

  // This second useEffect populates the form once the data has been fetched
  useEffect(() => {
    if (selectedQuestion) {
      setForm({
        qid: selectedQuestion.qid,
        title: selectedQuestion.title,
        description: selectedQuestion.description,
        sampleInput: selectedQuestion.sampleInput,
        sampleOutput: selectedQuestion.sampleOutput,
        constraints: selectedQuestion.constraints,
        company: selectedQuestion.company,
      });
      setTestCases(selectedQuestion.testCases || []);
    }
  }, [selectedQuestion]);

  if (status === "loading" || !form)
    return <p className="text-center text-white">Loading Question Data...</p>;
  if (status === "failed")
    return <p className="text-center text-red-500">Error: {error}</p>;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleTestCaseChange = (index, e) => {
    const newTestCases = [...testCases];
    newTestCases[index][e.target.name] = e.target.value;
    setTestCases(newTestCases);
  };

  const addTestCase = () => {
    setTestCases([...testCases, { input: "", expectedOutput: "" }]);
  };

  const removeTestCase = (index) => {
    const newTestCases = testCases.filter((_, i) => i !== index);
    setTestCases(newTestCases);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      testCases: testCases.filter(
        (tc) => tc.input.trim() !== "" || tc.expectedOutput.trim() !== ""
      ),
    };
    const resultAction = await dispatch(updateQuestion({ id, data: payload }));
    if (updateQuestion.fulfilled.match(resultAction)) {
      navigate(`/questions/${id}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-800 rounded-xl text-white">
      <h1 className="text-3xl font-bold text-cyan-300 mb-6">Update Question</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Static Fields */}
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block mb-1 font-semibold">{field.label}</label>
            {field.type === "textarea" ? (
              <textarea
                name={field.name}
                value={form[field.name] || ""}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-700 resize-y focus:ring-2 focus:ring-cyan-400 outline-none"
                rows={field.name === "description" ? 6 : 3}
              />
            ) : (
              <input
                type="text"
                name={field.name}
                value={form[field.name] || ""}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-700 focus:ring-2 focus:ring-cyan-400 outline-none"
              />
            )}
          </div>
        ))}

        {/* Dynamic Test Cases Section */}
        <div>
          <h2 className="text-2xl font-bold text-cyan-300 mb-4 border-t border-gray-600 pt-4">
            Test Cases for Judging
          </h2>
          {testCases.map((testCase, index) => (
            <div
              key={index}
              className="p-4 border border-gray-600 rounded-lg mb-4 relative"
            >
              <h3 className="font-semibold mb-2 text-gray-300">
                Test Case {index + 1}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Input</label>
                  <textarea
                    name="input"
                    value={testCase.input}
                    onChange={(e) => handleTestCaseChange(index, e)}
                    className="w-full p-2 rounded bg-gray-700 resize-y focus:ring-2 focus:ring-cyan-400 outline-none"
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block mb-1">Expected Output</label>
                  <textarea
                    name="expectedOutput"
                    value={testCase.expectedOutput}
                    onChange={(e) => handleTestCaseChange(index, e)}
                    className="w-full p-2 rounded bg-gray-700 resize-y focus:ring-2 focus:ring-cyan-400 outline-none"
                    rows={4}
                  />
                </div>
              </div>
              {testCases.length > 0 && (
                <button
                  type="button"
                  onClick={() => removeTestCase(index)}
                  className="absolute top-2 right-2 mt-2 bg-red-600 hover:bg-red-700 px-3 py-1 text-sm rounded transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addTestCase}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold transition-colors"
          >
            Add Another Test Case
          </button>
        </div>

        {error && <p className="text-red-500 text-center">Error: {error}</p>}

        <div className="border-t border-gray-600 pt-4">
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-yellow-500 hover:bg-yellow-600 px-4 py-3 rounded font-bold text-lg transition-all disabled:opacity-50"
          >
            {status === "loading" ? "Updating..." : "Update Question"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateQuestionPage;
