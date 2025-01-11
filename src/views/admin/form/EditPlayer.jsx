import React, { useState } from "react";
import InputField from "components/fields/InputField";
import { jwtDecode } from "jwt-decode"; // Use named import
import axios from "axios";
import Spinner from "./Spinner"; // Adjust the import path as needed

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

const EditPlayer = ({ isOpen, onClose }) => {
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
      student_name: e.target["full-name"].value,
      dob: e.target["dob"].value,
      height: e.target["height"].value,
      contact_number: e.target["contact-number"].value,
      school_name: e.target["school-name"].value,
      location: e.target["location"].value,
      class_or_level: e.target["class-or-level"].value,
      email_address: e.target["email-address"].value,
      preferred_position: e.target["preferred-position"].value,
      plays_for_another_club: e.target["plays-for-another-club"].value,
      achievements: e.target["achievements"].value,
      current_club: e.target["current-club"].value,
      image_data: imageBase64,
    };

    try {
      const response = await axios.post("http://127.0.0.1:5000/addstudent", studentData);
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
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 overflow-y-auto">
    <div className="bg-white dark:bg-navy-700 rounded-lg shadow-lg w-full max-w-2xl p-6 my-8">
        <div className="max-h-[80vh] overflow-y-auto">
          {loading && (
            <div className="spinner-overlay">
              <Spinner />
            </div>
          )}

          {/* Modal Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-navy-700 dark:text-white">
Edit Player            </h2>
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
              id="full-name"
              type="text"
              placeholder="Enter your full name"
              variant="auth"
              required
            />
            <InputField
              label="Date of Birth"
              id="dob"
              type="date"
              placeholder="mm/dd/yyyy"
              variant="auth"
              required
            />
            <InputField
              label="Height"
              id="height"
              type="text"
              placeholder="Enter height in ft/in"
              variant="auth"
              required
            />
            <InputField
              label="Contact Number"
              id="contact-number"
              type="tel"
              placeholder="+233"
              variant="auth"
              required
            />
            <InputField
              label="Name of Your School"
              id="school-name"
              type="text"
              placeholder="School Name"
              variant="auth"
              required
            />
            <InputField
              label="Location"
              id="location"
              type="text"
              placeholder="Enter the name of your location"
              variant="auth"
              required
            />
            <InputField
              label="Enter Class or Level"
              id="class-or-level"
              type="text"
              placeholder="Enter your class"
              variant="auth"
              required
            />
            <InputField
              label="Email Address (Optional)"
              id="email-address"
              type="email"
              placeholder="Enter your email address"
              variant="auth"
            />
            <div>
              <label
                htmlFor="preferred-position"
                className="block text-sm font-medium text-gray-700 dark:text-white"
              >
                Preferred Position
              </label>
              <select
                id="preferred-position"
                className="mt-2 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-navy-600 dark:text-white"
                required
              >
                <option value="">Select Position</option>
                <option value="Goalkeeper">Goalkeeper</option>
                <option value="Defender">Defender</option>
                <option value="Midfielder">Midfielder</option>
                <option value="Forward">Forward</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="plays-for-another-club"
                className="block text-sm font-medium text-gray-700 dark:text-white"
              >
                Do you a card with any club?
              </label>
              <select
                id="plays-for-another-club"
                className="mt-2 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-navy-600 dark:text-white"
                required
              >
                <option value="">Select an option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <InputField
              label="Current Club"
              id="current-club"
              type="text"
              placeholder="Enter the name of your current club"
              variant="auth"
            />
            <InputField
              label="Achievements (if any)"
              id="achievements"
              type="text"
              placeholder="List any achievements or awards"
              variant="auth"
            />
            <div>
              <label
                htmlFor="image-upload"
                className="block text-sm font-medium text-gray-700 dark:text-white"
              >
                Upload a Recent Photo (Optional)
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

          <div className="mt-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2 rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                required
              />
              I hereby declare that the information provided is accurate and truthful.
            </label>
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
            </div>

    </form>
  );
};

export default EditPlayer;