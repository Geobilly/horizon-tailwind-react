import React from "react";
import InputField from "components/fields/InputField";

const EditTerminal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-navy-700 rounded-lg shadow-lg w-full max-w-2xl p-6">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-navy-700 dark:text-white">
            Edit Terminal
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 dark:text-white text-xl font-bold"
          >
            &times;
          </button>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Row 1 */}
          <InputField
            label="Terminal Name"
            id="terminal-name"
            type="text"
            placeholder="Enter terminal name"
            variant="auth"
          />
          <InputField
            label="Price"
            id="price"
            type="number"
            placeholder="Enter price"
            variant="auth"
          />
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTerminal;
