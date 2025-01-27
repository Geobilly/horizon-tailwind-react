import React, { useState } from "react";
import InputField from "components/fields/InputField";
import { jwtDecode } from "jwt-decode"; // Use named import
import axios from "axios";
// import Spinner from "./Spinner"; // Adjust the import path as needed
import CircularWithValueLabel from "..//..//../components/loader/index"; // Import the loader component


const getSchoolIDFromToken = () => {
  const tokenData = localStorage.getItem("Edupay");
  if (tokenData) {
    try {
      const { token } = JSON.parse(tokenData); // Parse the stored object to extract the token
      const decodedToken = jwtDecode(token); // Use the correct function from jwt-decode
      return decodedToken.school_id; // Assuming "role" is a field in your token payload
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }
  return null;
};

const school_id = getSchoolIDFromToken();

const AddStudent = ({ isOpen, onClose }) => {
  const [imageFile, setImageFile] = useState(null); // For storing the File object
  const [imagePreview, setImagePreview] = useState(null); // For storing the preview URL
  const [loading, setLoading] = useState(false); // Loading state for API call

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // Store the file object for later conversion
      setImagePreview(URL.createObjectURL(file)); // Create and store the object URL for preview
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading before API call

    const imageBase64 = imageFile ? await convertImageToBase64(imageFile) : "";

    const studentData = {
      student_name: e.target["student-name"].value,
      class: e.target["class"].value,
      gender: e.target["gender"].value,
      dob: e.target["dob"].value,
      guardian_contact: e.target["parent-contact"].value,
      email_address: e.target["email-address"].value,
      school_id: school_id,
      guardian_name: e.target["guardian-name"].value,
      location: e.target["location"].value,
      image_data: imageBase64,
    };

    try {
      const response = await axios.post("https://edupaygh-backend.onrender.com/addstudent", studentData);
      alert(`Success: ${response.data.message}, Student ID: ${response.data.student_id}`);
      onClose(); // Close the modal after the success alert
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error === "Email already exists for this Student") {
        alert("Error: Email already exists for this student. Please use a different email.");
      } else {
        console.error("Error adding student:", error);
        alert("There was an error adding the student.");
      }
    } finally {
      setLoading(false); // Stop loading after API call
    }
  };

  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]); // Get only the base64 string
      reader.onerror = reject;
      reader.readAsDataURL(file); // Read the file object
    });
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
              Add Student
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
              label="Student Name"
              id="student-name"
              type="text"
              placeholder="Enter student name"
              variant="auth"
              required
            />
            <div>
              <label
                htmlFor="class"
                className="block text-sm font-medium text-gray-700 dark:text-white"
              >
                Class
              </label>
              <select
                id="class"
                className="mt-2 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-navy-600 dark:text-white"
                required
              >
                <option value="">Select Class</option>
                <option value="Class 1">Class 1</option>
                <option value="Class 2">Class 2</option>
                <option value="Class 3">Class 3</option>
                <option value="Class 4">Class 4</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700 dark:text-white"
              >
                Gender
              </label>
              <select
                id="gender"
                className="mt-2 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-navy-600 dark:text-white"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <InputField
              label="Date of Birth"
              id="dob"
              type="date"
              placeholder="Select date of birth"
              variant="auth"
              required
            />
            <InputField
              label="Guardian Contact"
              id="parent-contact"
              type="tel"
              placeholder="Enter parent's contact"
              variant="auth"
              required
            />
            <InputField
              label="Email Address"
              id="email-address"
              type="email"
              placeholder="Enter email address"
              variant="auth"
            />
            <InputField
              label="School ID"
              id="school-id"
              type="text"
              placeholder="Enter school ID"
              value={school_id}
              variant="auth"
              readOnly
            />
            <InputField
              label="Guardian Name"
              id="guardian-name"
              type="text"
              placeholder="Enter guardian name"
              variant="auth"
              required
            />
            <InputField
              label="Location"
              id="location"
              type="text"
              placeholder="Enter location"
              variant="auth"
              required
            />
            <div>
              <label
                htmlFor="image-upload"
                className="block text-sm font-medium text-gray-700 dark:text-white"
              >
                Upload Image (Optional)
              </label>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                className="mt-2 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-navy-600 dark:text-white"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="mt-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-md"
                  />
                </div>
              )}
            </div>
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

export default AddStudent;
