import { MdFileUpload } from "react-icons/md";
import Card from "components/card";
import React from "react";

const DeleteStudent = ({ isOpen, onClose }) => {
  // Return null if the modal is not open
  if (!isOpen) return null;

  return (
    // Modal backdrop
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      {/* Modal content */}
      <Card className="relative grid h-auto w-full max-w-2xl grid-cols-1 gap-3 rounded-[20px] bg-white bg-clip-border p-3 font-dm shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 dark:text-white text-xl font-bold"
        >
          &times;
        </button>

        {/* Delete confirmation section */}
        <div className="flex flex-col items-center justify-center text-center py-6">
          <h4 className="text-xl font-bold text-navy-700 dark:text-white mb-4">
            Are you sure you want to delete this student?
          </h4>
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-base font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 active:bg-red-700"
            >
              Delete
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-base font-medium text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 active:bg-gray-400 dark:bg-navy-700 dark:text-white dark:hover:bg-navy-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DeleteStudent;
