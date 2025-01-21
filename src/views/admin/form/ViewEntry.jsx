import React from "react";
import Card from "components/card"; // Ensure Card is imported correctly

const ViewEntry = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <Card className="relative grid h-auto w-full max-w-2xl grid-cols-1 gap-3 rounded-[20px] bg-white bg-clip-border p-6 font-dm shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 dark:text-white text-xl font-bold"
        >
          &times;
        </button>

        {/* Static Entry Details */}
        <div className="flex flex-col mb-4">
          <h3 className="text-lg font-bold text-navy-700 dark:text-white mb-2">Entry Details</h3>

          <p className="text-gray-700 dark:text-gray-300 mb-1">
            <strong>Class:</strong> Class 2 
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-1">
            <strong>Terminal:</strong> Bus 
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-1">
            <strong>Date:</strong> 12th September 2020
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-1">
            <strong> Amount:</strong> 100
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <strong>Status:</strong> Pending
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-80 pr-3"> {/* Set max height and add padding for scrollbar */}
          {/* Paid List */}
          <div className="mb-4">
            <h4 className="text-md font-bold text-navy-700 dark:text-white">Paid</h4>
            <ul className="list-decimal list-inside text-gray-700 dark:text-gray-300">
              <li>George Asborn</li>
              <li>Khadel Asborn</li>
              <li>John Asborn</li>
            </ul>
          </div>

          {/* Not Paid List */}
          <div className="mb-4">
            <h4 className="text-md font-bold text-navy-700 dark:text-white">Not Paid</h4>
            <ul className="list-decimal list-inside text-gray-700 dark:text-gray-300">
              <li>James Bird</li>
              <li>John Doe</li>
              <li>Samuel Doe</li>
              <li>Spencer</li>
              <li>Barfoi Aslom</li>
            </ul>
          </div>
          {/* Not Paid List */}
          <div className="mb-4">
            <h4 className="text-md font-bold text-navy-700 dark:text-white">Boarders</h4>
            <ul className="list-decimal list-inside text-gray-700 dark:text-gray-300">
              <li>James Bird</li>
              <li>John Doe</li>
              <li>Samuel Doe</li>
              <li>Spencer</li>
              <li>Barfoi Aslom</li>
            </ul>
          </div>
          {/* Not Paid List */}
          <div className="mb-4">
            <h4 className="text-md font-bold text-navy-700 dark:text-white">Sponsors</h4>
            <ul className="list-decimal list-inside text-gray-700 dark:text-gray-300">
              <li>James Bird</li>
              <li>John Doe</li>
              <li>Samuel Doe</li>
              <li>Spencer</li>
              <li>Barfoi Aslom</li>
            </ul>
          </div>

          {/* Advance List */}
          <div className="mb-6">
            <h4 className="text-md font-bold text-navy-700 dark:text-white">Advance</h4>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
              <li>Banes Sum - 5 days</li>
              <li>John Ask - 7 days</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-4">
          <button
            className="px-4 py-2 text-base font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 active:bg-blue-700"
          >
            Approve
          </button>
          {/* <button
            className="px-4 py-2 text-base font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 active:bg-red-700"
          >
            Delete
          </button> */}
        </div>
      </Card>
    </div>
  );
};

export default ViewEntry;