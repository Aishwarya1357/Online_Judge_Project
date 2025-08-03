// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { createQuestion } from "../store/questionSlice";

// // Updated fields to match the new model
// const fields = [
//   { name: "qid", label: "Question ID (e.g., 'two-sum')", type: "text" },
//   { name: "title", label: "Title", type: "text" },
//   { name: "description", label: "Description", type: "textarea" },
//   { name: "sampleInput", label: "Sample Input", type: "textarea" },
//   { name: "sampleOutput", label: "Sample Output", type: "textarea" },
//   { name: "constraints", label: "Constraints", type: "textarea" },
//   { name: "company", label: "Company", type: "text" },
// ];

// const CreateQuestionPage = () => {
//   const [form, setForm] = useState({
//     qid: "",
//     title: "",
//     description: "",
//     sampleInput: "",
//     sampleOutput: "",
//     constraints: "",
//     company: "",
//   });

//   // State to manage the list of test cases
//   const [testCases, setTestCases] = useState([
//     { input: "", expectedOutput: "" },
//   ]);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { status, error } = useSelector((state) => state.questions);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // Handler for changes in test case textareas
//   const handleTestCaseChange = (index, e) => {
//     const newTestCases = [...testCases];
//     newTestCases[index][e.target.name] = e.target.value;
//     setTestCases(newTestCases);
//   };

//   // Function to add a new empty test case
//   const addTestCase = () => {
//     setTestCases([...testCases, { input: "", expectedOutput: "" }]);
//   };

//   // Function to remove a test case by its index
//   const removeTestCase = (index) => {
//     const newTestCases = testCases.filter((_, i) => i !== index);
//     setTestCases(newTestCases);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     // Combine form data and test cases into one payload
//     const payload = {
//       ...form,
//       testCases: testCases.filter(
//         (tc) => tc.input.trim() !== "" || tc.expectedOutput.trim() !== ""
//       ), // Filter out empty ones
//     };

//     const resultAction = await dispatch(createQuestion(payload));
//     if (createQuestion.fulfilled.match(resultAction)) {
//       navigate("/questions");
//     }
//     // If it fails, the error will be displayed via the useSelector hook
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-gray-800 rounded-xl text-white">
//       <h1 className="text-3xl font-bold text-cyan-300 mb-6">
//         Create New Question
//       </h1>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Static Fields */}
//         {fields.map((field) => (
//           <div key={field.name}>
//             <label className="block mb-1 font-semibold">{field.label}</label>
//             {field.type === "textarea" ? (
//               <textarea
//                 name={field.name}
//                 value={form[field.name]}
//                 onChange={handleChange}
//                 className="w-full p-2 rounded bg-gray-700 resize-y focus:ring-2 focus:ring-cyan-400 outline-none"
//                 rows={field.name === "description" ? 6 : 3}
//                 placeholder={`Enter ${field.label}...`}
//               />
//             ) : (
//               <input
//                 type="text"
//                 name={field.name}
//                 value={form[field.name]}
//                 onChange={handleChange}
//                 className="w-full p-2 rounded bg-gray-700 focus:ring-2 focus:ring-cyan-400 outline-none"
//                 placeholder={`Enter ${field.label}...`}
//               />
//             )}
//           </div>
//         ))}

//         {/* Dynamic Test Cases Section */}
//         <div>
//           <h2 className="text-2xl font-bold text-cyan-300 mb-4 border-t border-gray-600 pt-4">
//             Test Cases for Judging
//           </h2>
//           {testCases.map((testCase, index) => (
//             <div
//               key={index}
//               className="p-4 border border-gray-600 rounded-lg mb-4 relative"
//             >
//               <h3 className="font-semibold mb-2 text-gray-300">
//                 Test Case {index + 1}
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block mb-1">Input</label>
//                   <textarea
//                     name="input"
//                     value={testCase.input}
//                     onChange={(e) => handleTestCaseChange(index, e)}
//                     className="w-full p-2 rounded bg-gray-700 resize-y focus:ring-2 focus:ring-cyan-400 outline-none"
//                     rows={4}
//                     placeholder="Test case input..."
//                   />
//                 </div>
//                 <div>
//                   <label className="block mb-1">Expected Output</label>
//                   <textarea
//                     name="expectedOutput"
//                     value={testCase.expectedOutput}
//                     onChange={(e) => handleTestCaseChange(index, e)}
//                     className="w-full p-2 rounded bg-gray-700 resize-y focus:ring-2 focus:ring-cyan-400 outline-none"
//                     rows={4}
//                     placeholder="Expected output..."
//                   />
//                 </div>
//               </div>
//               {testCases.length > 1 && (
//                 <button
//                   type="button"
//                   onClick={() => removeTestCase(index)}
//                   className="absolute top-2 right-2 mt-2 bg-red-600 hover:bg-red-700 px-3 py-1 text-sm rounded transition-colors"
//                 >
//                   Remove
//                 </button>
//               )}
//             </div>
//           ))}
//           <button
//             type="button"
//             onClick={addTestCase}
//             className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold transition-colors"
//           >
//             Add Another Test Case
//           </button>
//         </div>

//         {error && <p className="text-red-500 text-center">Error: {error}</p>}

//         <div className="border-t border-gray-600 pt-4">
//           <button
//             type="submit"
//             disabled={status === "loading"}
//             className="w-full bg-gradient-to-r from-cyan-400 to-teal-500 hover:from-cyan-500 hover:to-teal-600 px-4 py-3 rounded font-bold text-lg transition-all disabled:opacity-50"
//           >
//             {status === "loading" ? "Submitting..." : "Create Question"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };
// export default CreateQuestionPage;



import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// Import fetchQuestions to check for duplicate IDs
import { createQuestion, fetchQuestions } from "../store/questionSlice";

const fields = [
  {
    name: "qid",
    label: "Question ID (e.g., 'two-sum')",
    type: "text",
    required: true,
  },
  { name: "title", label: "Title", type: "text", required: true },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    required: true,
  },
  {
    name: "sampleInput",
    label: "Sample Input",
    type: "textarea",
    required: true,
  },
  {
    name: "sampleOutput",
    label: "Sample Output",
    type: "textarea",
    required: true,
  },
  {
    name: "constraints",
    label: "Constraints",
    type: "textarea",
    required: true,
  },
  { name: "company", label: "Company", type: "text", required: false },
];

const CreateQuestionPage = () => {
  const [form, setForm] = useState({
    qid: "",
    title: "",
    description: "",
    sampleInput: "",
    sampleOutput: "",
    constraints: "",
    company: "",
  });

  const [testCases, setTestCases] = useState([
    { input: "", expectedOutput: "" },
  ]);

  // --- NEW: State to hold all validation errors ---
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get the full list of questions to check for duplicate IDs
  const {
    list: questions,
    status,
    error: submissionError,
  } = useSelector((state) => state.questions);

  // Fetch questions if they aren't already in the store
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchQuestions());
    }
  }, [dispatch, status]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error for the field being edited
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleTestCaseChange = (index, e) => {
    const newTestCases = [...testCases];
    newTestCases[index][e.target.name] = e.target.value;
    setTestCases(newTestCases);
    // Clear test case error when user starts typing
    if (errors.testCases) {
      setErrors({ ...errors, testCases: null });
    }
  };

  const addTestCase = () => {
    setTestCases([...testCases, { input: "", expectedOutput: "" }]);
  };

  const removeTestCase = (index) => {
    const newTestCases = testCases.filter((_, i) => i !== index);
    setTestCases(newTestCases);
  };

  // --- NEW: Comprehensive validation function ---
  const validateForm = () => {
    const newErrors = {};

    // 1. Check required fields
    fields.forEach((field) => {
      if (field.required && !form[field.name].trim()) {
        newErrors[field.name] = `${field.label} is required.`;
      }
    });

    // 2. Check for duplicate Question ID
    if (form.qid && questions.some((q) => q.qid === form.qid.trim())) {
      newErrors.qid = "A question with this ID already exists.";
    }

    // 3. Check for at least one valid test case
    const validTestCases = testCases.filter(
      (tc) => tc.input.trim() !== "" || tc.expectedOutput.trim() !== ""
    );
    if (validTestCases.length === 0) {
      newErrors.testCases = "At least one complete test case is required.";
    }

    setErrors(newErrors);
    // Return true if there are no errors, false otherwise
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Stop submission if validation fails
    if (!validateForm()) {
      return;
    }

    const payload = {
      ...form,
      testCases: testCases.filter(
        (tc) => tc.input.trim() !== "" || tc.expectedOutput.trim() !== ""
      ),
    };

    const resultAction = await dispatch(createQuestion(payload));
    if (createQuestion.fulfilled.match(resultAction)) {
      navigate("/questions");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-800 rounded-xl text-white">
      <h1 className="text-3xl font-bold text-cyan-300 mb-6">
        Create New Question
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Static Fields */}
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block mb-1 font-semibold">{field.label}</label>
            {field.type === "textarea" ? (
              <textarea
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                className={`w-full p-2 rounded bg-gray-700 resize-y focus:ring-2 outline-none ${
                  errors[field.name] ? "ring-red-500" : "focus:ring-cyan-400"
                }`}
                rows={field.name === "description" ? 6 : 3}
                placeholder={`Enter ${field.label}...`}
              />
            ) : (
              <input
                type="text"
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                className={`w-full p-2 rounded bg-gray-700 focus:ring-2 outline-none ${
                  errors[field.name] ? "ring-red-500" : "focus:ring-cyan-400"
                }`}
                placeholder={`Enter ${field.label}...`}
              />
            )}
            {/* --- NEW: Display field-specific error --- */}
            {errors[field.name] && (
              <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
            )}
          </div>
        ))}

        {/* Dynamic Test Cases Section */}
        <div>
          <h2 className="text-2xl font-bold text-cyan-300 mb-4 border-t border-gray-600 pt-4">
            Test Cases for Judging
          </h2>
          {/* --- NEW: Display test case error --- */}
          {errors.testCases && (
            <p className="text-red-500 mb-4">{errors.testCases}</p>
          )}

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
                    placeholder="Test case input..."
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
                    placeholder="Expected output..."
                  />
                </div>
              </div>
              {testCases.length > 1 && (
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

        {submissionError && (
          <p className="text-red-500 text-center">Error: {submissionError}</p>
        )}

        <div className="border-t border-gray-600 pt-4">
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-gradient-to-r from-cyan-400 to-teal-500 hover:from-cyan-500 hover:to-teal-600 px-4 py-3 rounded font-bold text-lg transition-all disabled:opacity-50"
          >
            {status === "loading" ? "Submitting..." : "Create Question"}
          </button>
        </div>
      </form>
    </div>
  );
};
export default CreateQuestionPage;