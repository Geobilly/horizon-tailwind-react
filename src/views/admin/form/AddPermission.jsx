import React, { useState, useEffect } from "react";
import InputField from "components/fields/InputField";
import CircularWithValueLabel from "../../../components/loader/index";
import { jwtDecode } from "jwt-decode";

const AddPermission = ({ isOpen, onClose }) => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [terminals, setTerminals] = useState([]);
  const [reason, setReason] = useState("");
  const [selectedTerminal, setSelectedTerminal] = useState("");

  const getSchoolId = () => {
    const userToken = JSON.parse(localStorage.getItem("Edupay"))?.token;
    if (userToken) {
      const decodedToken = jwtDecode(userToken);
      return decodedToken.school_id;
    }
    return null;
  };

  useEffect(() => {
    if (isOpen) {
      fetchStudents();
      fetchTerminals();
    }
  }, [isOpen]);

  const fetchStudents = async () => {
    const schoolId = getSchoolId();
    if (!schoolId) return;
    try {
      const response = await fetch(`https://edupaygh-backend.onrender.com/fetchstudents/${schoolId}`);
      const data = await response.json();
      setStudents(data.students);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchTerminals = async () => {
    const schoolId = getSchoolId();
    if (!schoolId) return;
    try {
      const response = await fetch(`https://edupaygh-backend.onrender.com/fetchterminal/${schoolId}`);
      const data = await response.json();
      setTerminals(data.terminals);
    } catch (error) {
      console.error("Error fetching terminals:", error);
    }
  };

  const handleStudentChange = (e) => {
    const student = students.find((s) => s.student_id === e.target.value);
    setSelectedStudent(student);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const schoolId = getSchoolId();
      if (!schoolId) throw new Error("School ID not found");

      const formData = new FormData();
      formData.append('student_id', selectedStudent.student_id);
      formData.append('student_name', selectedStudent.student_name);
      formData.append('class', selectedStudent.class);
      formData.append('school_id', schoolId);
      formData.append('guardian_contact', selectedStudent.guardian_contact);
      formData.append('terminal', selectedTerminal);
      formData.append('reason', reason);
      if (file) {
        formData.append('file', file);
      }

      const response = await fetch('https://edupaygh-backend.onrender.com/addpermission', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit permission request');
      }

      const data = await response.json();
      alert(data.message);
      setSelectedStudent(null);
      setFile(null);
      setReason("");
      setSelectedTerminal("");
      onClose(true);
    } catch (error) {
      console.error("Error submitting permission:", error);
      alert(error.message || "Failed to submit permission request");
      onClose(false);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <form onSubmit={handleSubmit}>
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-50">
        <div className="bg-white dark:bg-navy-700 rounded-lg shadow-lg w-full max-w-2xl p-6">
          {loading && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[1000] backdrop-blur-md">
              <CircularWithValueLabel size={80} color="#36d7b7" />
            </div>
          )}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-navy-700 dark:text-white">Add Permission</h2>
            <button onClick={onClose} className="text-gray-600 dark:text-white text-xl font-bold">&times;</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white">Student Name</label>
              <select 
                className="mt-2 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-navy-600 dark:text-white" 
                required 
                onChange={handleStudentChange}
              >
                <option value="">Select Student</option>
                {students.map((student) => (
                  <option key={student.student_id} value={student.student_id}>{student.student_name}</option>
                ))}
              </select>
            </div>
            <InputField label="Class" id="class" type="text" value={selectedStudent?.class || ""} readOnly variant="auth" required />
            <InputField label="Guardian Contact" id="guardian-contact" type="tel" value={selectedStudent?.guardian_contact || ""} readOnly variant="auth" required />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white">Terminal</label>
              <select 
                className="mt-2 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-navy-600 dark:text-white" 
                required
                value={selectedTerminal}
                onChange={(e) => setSelectedTerminal(e.target.value)}
              >
                <option value="">Select Terminal</option>
                {terminals.map((terminal) => (
                  <option key={terminal.id} value={terminal.terminal_name}>{terminal.terminal_name}</option>
                ))}
              </select>
            </div>
            <InputField 
              label="Reason" 
              id="reason" 
              type="text" 
              placeholder="Enter reason" 
              variant="auth" 
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white">Upload File (Picture/Doc)</label>
              <input 
                type="file" 
                className="mt-2 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-navy-600 dark:text-white" 
                onChange={handleFileChange}
                required
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button 
              type="submit"
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

export default AddPermission;
