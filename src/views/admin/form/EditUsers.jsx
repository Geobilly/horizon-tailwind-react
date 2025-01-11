import React, { useState, useEffect } from "react";

// Reusable Input Field Component
const InputField = ({ label, id, name, type, value, onChange }) => (
  <div className="flex flex-col">
    <label htmlFor={id} className="text-sm font-bold text-navy-700 dark:text-white">
      {label}
    </label>
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      className="mt-2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-navy-800 dark:border-gray-600 dark:text-white"
    />
  </div>
);

const EditUsers = ({ isOpen, onClose, studentId }) => {
  const [studentData, setStudentData] = useState({
    name: "",
    class: "",
    gender: "",
    dob: "",
    parentContact: "",
    email: "",
    guardianName: "",
    image: null,
  });

  // Fetch student data when `studentId` changes
  useEffect(() => {
    if (studentId) {
      const fetchStudentData = async () => {
        try {
          const response = await fetch(`/api/students/${studentId}`);
          if (response.ok) {
            const data = await response.json();
            setStudentData(data);
          } else {
            console.error("Failed to fetch student data");
          }
        } catch (error) {
          console.error("Error fetching student data:", error);
        }
      };

      fetchStudentData();
    }
  }, [studentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/students/${studentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentData),
      });

      if (response.ok) {
        alert("Student updated successfully");
        onClose();
      } else {
        alert("Failed to update student");
      }
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-navy-700 rounded-lg shadow-lg w-full max-w-2xl p-6">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-navy-700 dark:text-white">
            Edit User
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 dark:text-white text-xl font-bold"
          >
            &times;
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label=" Name"
              id="student-name"
              name="name"
              type="text"
              value={studentData.name}
              onChange={handleChange}
            />
            <InputField
              label="Role"
              id="student-class"
              name="class"
              type="text"
              value={studentData.class}
              onChange={handleChange}
            />
            <InputField
              label="Gender"
              id="student-gender"
              name="gender"
              type="text"
              value={studentData.gender}
              onChange={handleChange}
            />
            {/* <InputField
              label="Date of Birth"
              id="student-dob"
              name="dob"
              type="date"
              value={studentData.dob}
              onChange={handleChange}
            /> */}
            <InputField
              label=" Contact"
              id="parent-contact"
              name="parentContact"
              type="text"
              value={studentData.parentContact}
              onChange={handleChange}
            />
            {/* <InputField
              label="Email"
              id="student-email"
              name="email"
              type="email"
              value={studentData.email}
              onChange={handleChange}
            /> */}
            {/* <InputField
              label="Guardian Name"
              id="guardian-name"
              name="guardianName"
              type="text"
              value={studentData.guardianName}
              onChange={handleChange}
            /> */}
            {/* <div className="flex flex-col">
              <label htmlFor="student-image" className="text-sm font-bold text-navy-700 dark:text-white">
                Upload Image
              </label>
              <input
                id="student-image"
                name="image"
                type="file"
                onChange={(e) =>
                  setStudentData((prev) => ({
                    ...prev,
                    image: e.target.files[0],
                  }))
                }
                className="mt-2"
              />
            </div> */}
          </div>

          {/* Save Button */}
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUsers;
