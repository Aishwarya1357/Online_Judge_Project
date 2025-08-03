import Editor from "@monaco-editor/react";

const EditorComponent = ({ value, onChange, language }) => {
    return (
      <Editor
        height="400px"
        language={language}
        defaultValue="// Write your code here"
        theme="vs-dark"
        value={value}
        onChange={(value) => onChange(value || "")}
      />
    );
}
export default EditorComponent;