import React, { useState } from "react";
import Card from "components/card"; // Ensure Card is imported correctly
import CircularWithValueLabel from "../../../components/loader/index"; // Import the loader component

const ViewEntry = ({ isOpen, onClose, entry }) => {
  const [loading, setLoading] = useState(false); // Loading state for API call

  if (!isOpen || !entry) return null; // Ensure entry exists before rendering

  const approveEntry = async (entry_id) => {
    setLoading(true); // Start loading before the API call
    try {
      const response = await fetch("https://edupaygh-backend.onrender.com/update_status", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entry_id: entry_id, // Send entry_id instead of created_at
          status: "Approved",  // You may want to send the status as well
        }),
      });
  
      if (response.ok) {
        alert("Entry Approved");
        onClose(); // Close the modal
      } else {
        alert("Failed to approve the entry");
      }
    } catch (error) {
      console.error("Error approving entry:", error);
      alert("An error occurred while approving the entry");
    } finally {
      setLoading(false); // Stop loading after API call
    }
  };
  

  const categorizeStudents = (students) => {
    const paid = [];
    const sponsors = [];
    const advance = [];
    const credit = [];
    const boarders = [];
  
    students.forEach((student) => {
      if (student.paid === "Yes") paid.push(student.student_name);
      if (student.sponsor === "Yes") sponsors.push(student.student_name);
      if (student.credit === "Yes") credit.push(student.student_name);
      if (student.boarder === "Yes") boarders.push(student.student_name);
      if (student.number_of_advance > 0) {
        advance.push(`${student.student_name} - ${student.number_of_advance} days`);
      }
    });
  
    return { paid, sponsors, credit, advance, boarders };
  };
  

  const { paid, sponsors, credit, advance, boarders } = categorizeStudents(entry.students || []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-50">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[1000] backdrop-blur-md">
          <CircularWithValueLabel size={80} color="#36d7b7" />
        </div>
      )}

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
          {/* <p className="text-gray-700 dark:text-gray-300 mb-1">
            <strong>ID:</strong> {entry.id}
          </p> */}
          <p className="text-gray-700 dark:text-gray-300 mb-1">
            <strong>ID:</strong> {entry.entry_id}
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-1">
            <strong>Class:</strong> {entry.class}
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-1">
            <strong>Terminal:</strong> {entry.terminal}
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-1">
            <strong>Date:</strong> {entry.created_at}
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-1">
            <strong>Amount:</strong> {entry.total_amount} mb-1 solistic 
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <strong>Status:</strong> {entry.status}
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-80 pr-3">
          {paid.length > 0 && (
            <div className="mb-4">
              <h4 className="text-md font-bold text-navy-700 dark:text-white">Paid</h4>
              <ul className="list-decimal list-inside text-gray-700 dark:text-gray-300">
                {paid.map((name, index) => (
                  <li key={index}>{name}</li>
                ))}
              </ul>
            </div>
          )}

          {sponsors.length > 0 && (
            <div className="mb-4">
              <h4 className="text-md font-bold text-navy-700 dark:text-white">Sponsors</h4>
              <ul className="list-decimal list-inside text-gray-700 dark:text-gray-300">
                {sponsors.map((name, index) => (
                  <li key={index}>{name}</li>
                ))}
              </ul>
            </div>
          )}

          {boarders.length > 0 && (
            <div className="mb-4">
              <h4 className="text-md font-bold text-navy-700 dark:text-white">Boarders</h4>
              <ul className="list-decimal list-inside text-gray-700 dark:text-gray-300">
                {boarders.map((name, index) => (
                  <li key={index}>{name}</li>
                ))}
              </ul>
            </div>
          )}

          {advance.length > 0 && (
            <div className="mb-6">
              <h4 className="text-md font-bold text-navy-700 dark:text-white">Advance</h4>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                {advance.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </div>
          )}

          {credit.length > 0 && (
            <div className="mb-6">
              <h4 className="text-md font-bold text-navy-700 dark:text-white">Owing</h4>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                {credit.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-4">
          <button
            className="px-4 py-2 text-base font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 active:bg-blue-700"
            onClick={() => approveEntry(entry.entry_id)}
          >
            Approve
          </button>
        </div>
      </Card>
    </div>
  );
};

export default ViewEntry;
