import React, { useState, useEffect } from "react";
import InputField from "components/fields/InputField";
import { jwtDecode } from "jwt-decode"; // Use named import
import axios from "axios";
import CircularWithValueLabel from "..//..//../components/loader/index"; // Import the loader component

const AddUser = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false); // Loading state for API call
  const [schoolId, setSchoolId] = useState(""); // Store school ID
  const [schoolName, setSchoolName] = useState(""); // Store school name
  const [role, setRole] = useState(""); // To track the selected role


  // Fetch school details from JWT
  const fetchSchoolDetailsFromJWT = () => {
    const edupayData = localStorage.getItem("Edupay");
    if (edupayData) {
      try {
        const parsedData = JSON.parse(edupayData);
        const decodedToken = jwtDecode(parsedData.token);
        setSchoolId(decodedToken.school_id || "");
        setSchoolName(decodedToken.school_name || "");
      } catch (error) {
        console.error("Error decoding JWT or parsing Edupay data:", error);
      }
    }
  };

  useEffect(() => {
    fetchSchoolDetailsFromJWT(); // Fetch school details when the component mounts
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading before API call

    const userData = {
      name: e.target["name"].value, // Adjusted field name to "name"
      contact: e.target["contact"].value,
      email: e.target["email"].value, // Adjusted field name to "email"
      school_id: schoolId,
      school_name: schoolName, // Add school name
      role: e.target["role"].value,
      classlevel: e.target["classlevel"].value,

      password: e.target["password"].value, // Include password
    };

    try {
      const response = await axios.post("https://edupaygh-backend.onrender.com/adduser", userData);
      alert(`Success: ${response.data.message}`);
      onClose(); // Close the modal after the success alert
    } catch (error) {
      console.error("Error adding user:", error);
      alert("There was an error adding the user.");
    } finally {
      setLoading(false); // Stop loading after API call
    }
  };

  if (!isOpen) return null;

  return (
    <form onSubmit={handleSubmit}>
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-white dark:bg-navy-700 rounded-lg shadow-lg w-full max-w-2xl p-6">
          {loading && (
            <div className="spinner-overlay">
              <CircularWithValueLabel size={80} color="#36d7b7" />
            </div>
          )}

          {/* Modal Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-navy-700 dark:text-white">
              Add User
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
            <InputField
              label="Full Name"
              id="name"
              type="text"
              placeholder="Enter full name"
              variant="auth"
              required
            />
            <InputField
              label="Contact (Phone Number)"
              id="contact"
              type="tel"
              placeholder="Enter phone number"
              variant="auth"
              required
            />
            <InputField
              label="Email Address"
              id="email"
              type="email"
              placeholder="Enter email address"
              variant="auth"
            />
          <div>
  <label
    htmlFor="role"
    className="block text-sm font-medium text-gray-700 dark:text-white"
  >
    Role
  </label>
  <select
    id="role"
    className="mt-2 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-navy-600 dark:text-white"
    required
    onChange={(e) => setRole(e.target.value)} // Track role selection
  >
    <option value="">Select Role</option>
    <option value="teacher">Teacher</option>
    <option value="admin">Admin</option>
    <option value="accountant">Accountant</option>
  </select>
</div>

{role === "teacher" && ( // Conditionally render class dropdown if role is teacher
  <div>
    <label
      htmlFor="class"
      className="block text-sm font-medium text-gray-700 dark:text-white"
    >
      Class
    </label>
    <select
      id="classlevel"
      className="mt-2 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-navy-600 dark:text-white"
      required
    >
      <option value="">Select Class</option>
      <option value="Class 1">Class 1</option>
      <option value="Class 2">Class 2</option>
      <option value="Class 3">Class 3</option>
    </select>
  </div>
)}


            {/* Password Field */}
            <InputField
              label="Password"
              id="password"
              type="password"
              placeholder="Enter password"
              variant="auth"
              required
            />
          </div>

          <div className="mt-6 flex justify-end">
            <button
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddUser;
