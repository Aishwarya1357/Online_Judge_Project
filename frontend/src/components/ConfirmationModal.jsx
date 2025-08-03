import React from "react";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  if (!isOpen) return null;

  return (
    // The change is in this line: removed bg-black and bg-opacity-70, added backdrop-blur-sm
    <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-gray-800 p-8 rounded-xl text-white max-w-md w-full shadow-2xl border border-gray-700">
        <h2 className="text-2xl font-bold text-red-500 mb-4">{title}</h2>
        <p className="text-gray-300 mb-8">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded font-semibold bg-gray-600 hover:bg-gray-500 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 rounded font-semibold bg-red-600 hover:bg-red-700 transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
