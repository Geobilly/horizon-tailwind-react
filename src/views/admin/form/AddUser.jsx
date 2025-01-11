import React, { useState } from "react";
import InputField from "components/fields/InputField";

const AddUser = ({ isOpen, onClose }) => {
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // Preview the uploaded image
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-navy-700 rounded-lg shadow-lg w-full max-w-2xl p-6">
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
          {/* Full Name */}
          <InputField
            label="Full Name"
            id="full-name"
            type="text"
            placeholder="Enter full name"
            variant="auth"
            required
          />

          {/* Contact (Phone Number) */}
          <InputField
            label="Contact (Phone Number)"
            id="contact-number"
            type="tel"
            placeholder="Enter phone number"
            variant="auth"
            required
          />

          {/* Email */}
          <InputField
            label="Email"
            id="email"
            type="email"
            placeholder="Enter email address"
            variant="auth"
            required
          />

          {/* Role */}
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
            >
              <option value="">Select Role</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
              <option value="accountant">Accountant</option>
            </select>
          </div>

          {/* Gender */}
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
        </div>

        {/* Image Upload */}
        {/* <div className="mt-4">
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
          {image && (
            <div className="mt-4">
              <img
                src={image}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-md"
              />
            </div>
          )}
        </div> */}

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
