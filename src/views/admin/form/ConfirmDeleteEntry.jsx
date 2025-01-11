import React from "react";
import InputField from "components/fields/InputField";

const ConfirmDeleteEntry = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-navy-700 rounded-lg shadow-lg w-full max-w-2xl p-6">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-navy-700 dark:text-white">
            Confirm Deletion
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 dark:text-white text-xl font-bold"
          >
            &times;
          </button>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 gap-4">
          {/* Reason */}
          <InputField
            label="Reason for Deletion"
            id="reason"
            type="text"
            placeholder="Enter the reason for deleting this entry"
            variant="auth"
          />

          {/* Delete Button */}
          <div className="mt-4">
            <button
              className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={() => console.log('Entry Deleted')} // Replace with actual delete logic
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteEntry;
