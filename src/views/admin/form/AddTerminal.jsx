import React, { useState } from "react";
import axios from "axios";
import CircularWithValueLabel from "..//..//../components/loader/index"; // Import the loader component
import InputField from "components/fields/InputField";
import { jwtDecode } from "jwt-decode"; // Use named import

const AddTerminal = ({ isOpen, onClose }) => {
  const [terminalName, setTerminalName] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);


  const getSchoolId = () => {
    const userToken = JSON.parse(localStorage.getItem("Edupay"))?.token;
    if (userToken) {
      const decodedToken = jwtDecode(userToken);
      return decodedToken.school_id;
    }
    return null;
  };

  const handleSave = async () => {
    setLoading(true);
    const schoolId = getSchoolId();
    
    if (schoolId) {
      try {
        await axios.post("https://edupaygh-backend.onrender.com/add_terminal", {
          school_id: schoolId,
          terminal_name: terminalName,
          price: parseFloat(price),
        });
       // On success, show alert and close modal
      // On success, show a browser alert
      alert("Terminal added successfully!");
      onClose(); // Close the modal on success
    } catch (error) {
      // On error, show a browser alert with the error message
      alert("Error adding terminal. Please try again.");
    }
  }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
<div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-50">
<div className="bg-white dark:bg-navy-700 rounded-lg shadow-lg w-full max-w-2xl p-6">
          {loading && (
           <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[1000] backdrop-blur-md">
             <CircularWithValueLabel size={80} color="#36d7b7" />
           </div>
         )}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-navy-700 dark:text-white">
            Add Terminal
          </h2>
          <button onClick={onClose} className="text-gray-600 dark:text-white text-xl font-bold">
            &times;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Terminal Name"
            id="terminal-name"
            type="text"
            value={terminalName}
            onChange={(e) => setTerminalName(e.target.value)}
            placeholder="Enter terminal name"
            variant="auth"
          />
          <InputField
            label="Price"
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
            variant="auth"
          />
        </div>
        {/* Alert Message */}
        {/* {alertMessage && (
          <div className="mt-4 text-center text-red-500">
            <p>{alertMessage}</p>
          </div>
        )} */}

        <div className="mt-6 flex justify-end">
          {/* {loading ? (
            <CircularWithValueLabel />
          ) : ( */}
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              Save
            </button>
          {/* )} */}
        </div>
      </div>
    </div>
  );
};

export default AddTerminal;
