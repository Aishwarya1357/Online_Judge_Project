import React from "react";

const VerdictComponent = ({ verdict }) => {
  if (!verdict) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "Accepted":
        return "text-green-500";
      case "Submitted":
        return "text-blue-500";
      case "Wrong Answer":
        return "text-red-500";
      case "Compilation Error":
      case "Runtime Error":
        return "text-yellow-500";
      case "Timeout":
        return "text-orange-500";
      default:
        return "text-gray-400";
    }
  };

  const formatOutput = (output) => {
    if (!output) return "";
    
    // If output contains test case failure information, format it nicely
    if (output.includes("Failed on test case")) {
      const lines = output.split('\n');
      let formattedOutput = "";
      let currentSection = "";
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.includes("Input:")) {
          currentSection = "input";
          formattedOutput += "\n📥 **Input:**\n";
        } else if (line.includes("Expected Output:")) {
          currentSection = "expected";
          formattedOutput += "\n✅ **Expected Output:**\n";
        } else if (line.includes("Your Output:")) {
          currentSection = "actual";
          formattedOutput += "\n❌ **Your Output:**\n";
        } else if (line.trim() !== "") {
          if (currentSection === "input") {
            formattedOutput += `  ${line}\n`;
          } else if (currentSection === "expected") {
            formattedOutput += `  ${line}\n`;
          } else if (currentSection === "actual") {
            formattedOutput += `  ${line}\n`;
          } else {
            formattedOutput += `${line}\n`;
          }
        }
      }
      return formattedOutput;
    }
    
    return output;
  };

  return (
    <div className="mt-6 p-4 bg-gray-900 rounded-lg">
      <h3 className="text-xl font-bold mb-2">Submission Result</h3>
      <p>
        <strong>Status: </strong>
        <span className={`font-bold ${getStatusColor(verdict.status)}`}>
          {verdict.status}
        </span>
      </p>
      {verdict.status !== "Accepted" && verdict.output && (
        <div className="mt-2">
          <strong>Details:</strong>
          <pre className="bg-black p-2 rounded mt-1 whitespace-pre-wrap text-sm text-gray-300">
            {formatOutput(verdict.output)}
          </pre>
        </div>
      )}
      {verdict.status === "Accepted" && (
        <div className="mt-2">
          <strong className="text-green-500">🎉 Congratulations! All test cases passed!</strong>
        </div>
      )}
      {verdict.status === "Submitted" && (
        <div className="mt-2">
          <strong className="text-blue-500">⏳ Processing your submission...</strong>
        </div>
      )}
    </div>
  );
};

export default VerdictComponent;
