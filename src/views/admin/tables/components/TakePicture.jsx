import React, { useEffect, useState } from "react";
import { MdCameraAlt, MdSearch, MdClose, MdArrowBack } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TakePicture = ({ onTakePicture }) => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [loading, setLoading] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [activeStudent, setActiveStudent] = useState(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [photoData, setPhotoData] = useState(null);
  const [error, setError] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState("user"); // 'user' for front, 'environment' for back
  const videoRef = React.useRef(null);
  const canvasRef = React.useRef(null);

  // Helper to get user data from localStorage
  const getUserData = () => {
    const userData = JSON.parse(localStorage.getItem("Edupay"))?.user;
    return userData || null;
  };

  // Fetch students from API on mount
  useEffect(() => {
    const fetchStudents = async () => {
      const userData = getUserData();
      if (!userData?.classlevel) {
        setStudents([]);
        setFilteredStudents([]);
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(`https://edupaygh-backend.onrender.com/fetchstudents/K-001/${userData.classlevel}`);
        const data = await response.json();
        const studentsList = (data.students || []).map(student => ({
          id: student.student_id,
          name: student.student_name,
          class: student.class
        }));
        setStudents(studentsList);
        setFilteredStudents(studentsList);
      } catch (error) {
        setStudents([]);
        setFilteredStudents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  // Filter students when name changes
  useEffect(() => {
    let filtered = students;
    if (studentName.trim() !== "") {
      filtered = filtered.filter((s) =>
        s.name.toLowerCase().includes(studentName.trim().toLowerCase())
      );
    }
    setFilteredStudents(filtered);
  }, [studentName, students]);

  // Camera logic
  const startCamera = () => {
    setError("");
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: cameraFacingMode } })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        })
        .catch(() => {
          setError("Unable to access camera. Please check your device permissions.");
        });
    } else {
      setError("Camera not supported in this browser.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  const handleSwitchCamera = () => {
    setCameraFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  // Restart camera when facing mode changes and camera is open
  useEffect(() => {
    if (cameraOpen) {
      stopCamera();
      setTimeout(() => startCamera(), 200);
    }
    // eslint-disable-next-line
  }, [cameraFacingMode]);

  const handleOpenCamera = (student) => {
    setActiveStudent(student);
    setCameraOpen(true);
    setHasPhoto(false);
    setPhotoData(null);
    setTimeout(() => startCamera(), 200); // slight delay to ensure modal is open
  };

  const handleCloseCamera = () => {
    stopCamera();
    setCameraOpen(false);
    setActiveStudent(null);
    setHasPhoto(false);
    setPhotoData(null);
    setError("");
  };

  const handleCapture = () => {
    const width = 320;
    const height = 240;
    const context = canvasRef.current.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, width, height);
    const dataUrl = canvasRef.current.toDataURL("image/png");
    setPhotoData(dataUrl);
    setHasPhoto(true);
    stopCamera();
  };

  const handleRetake = () => {
    setHasPhoto(false);
    setPhotoData(null);
    startCamera();
  };

  const handleConfirm = async () => {
    if (onTakePicture && activeStudent && photoData) {
      onTakePicture({ student: activeStudent, photo: photoData });
    }
    const base64Image = photoData.replace(/^data:image\/\w+;base64,/, "");
    setConfirmLoading(true);
    try {
      const response = await fetch("https://edupaygh-backend.onrender.com/updatepic", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_id: activeStudent.id,
          image_data: base64Image,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        toast.error(result.error || "Failed to update student image.");
      } else {
        toast.success("Student image updated successfully!");
        handleCloseCamera();
      }
    } catch (err) {
      toast.error("Network error. Could not update image.");
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900/80 to-blue-400/80 flex flex-col items-center py-6 px-1 sm:px-4">
      <ToastContainer />
      <div className="w-full max-w-2xl bg-white dark:bg-navy-800 rounded-2xl shadow-xl p-4 sm:p-8 animate-fadeIn mt-2 sm:mt-8">
        <h2 className="text-xl sm:text-2xl font-bold text-navy-700 dark:text-white mb-4 sm:mb-6 text-center">Student Picture Capture</h2>
        {/* Search Bar (only student name) */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8 items-center justify-center w-full">
          <div className="flex items-center w-full sm:w-2/3 bg-gray-100 dark:bg-navy-700 rounded-lg px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-400">
            <MdSearch className="text-gray-400 mr-2" size={22} />
            <input
              type="text"
              placeholder="Search by student name..."
              className="bg-transparent outline-none w-full text-navy-700 dark:text-white placeholder-gray-400 text-base sm:text-lg"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
            />
          </div>
        </div>
        {/* Student List */}
        <div className="overflow-x-auto rounded-lg border border-gray-100 dark:border-navy-700 bg-white dark:bg-navy-800">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-navy-600 text-sm sm:text-base">
            <thead>
              <tr>
                <th className="px-2 sm:px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-2 sm:px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Class</th>
                <th className="px-2 sm:px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="text-center py-8 text-blue-500 dark:text-blue-300 animate-pulse">Loading students...</td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-8 text-gray-400 dark:text-gray-500">No students found.</td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-blue-50 dark:hover:bg-navy-700 transition">
                    <td className="px-2 sm:px-4 py-3 font-medium text-navy-800 dark:text-white whitespace-nowrap">{student.name}</td>
                    <td className="px-2 sm:px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">{student.class}</td>
                    <td className="px-2 sm:px-4 py-3">
                      <button
                        onClick={() => handleOpenCamera(student)}
                        className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 transition"
                        aria-label={`Take picture of ${student.name}`}
                      >
                        <MdCameraAlt size={20} className="text-blue-600 dark:text-blue-400" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Camera Modal */}
      {cameraOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn px-2 sm:px-0">
          <div className="bg-white dark:bg-navy-800 rounded-2xl shadow-2xl p-3 sm:p-6 w-full max-w-xs sm:max-w-md flex flex-col items-center relative">
            <button
              onClick={handleCloseCamera}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-white p-2 rounded-full transition focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Close"
            >
              <MdClose size={24} />
            </button>
            {/* Switch Camera Button */}
            <button
              onClick={handleSwitchCamera}
              className="absolute top-2 left-2 text-blue-500 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-100 p-2 rounded-full transition focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-100 dark:bg-blue-900 shadow"
              aria-label="Switch camera"
              title="Switch camera"
              type="button"
            >
              {/* Camera switch icon (using MdCameraAlt with rotate) */}
              <span style={{ display: 'inline-block', transform: 'scaleX(-1) rotate(90deg)' }}>
                <MdCameraAlt size={22} />
              </span>
            </button>
            <h3 className="text-lg sm:text-xl font-bold text-navy-700 dark:text-white mb-2 sm:mb-4 text-center w-full">
              Take Picture for <span className="text-blue-600 dark:text-blue-400">{activeStudent?.name}</span>
            </h3>
            {error ? (
              <div className="text-red-500 mb-4 text-center text-sm sm:text-base">{error}</div>
            ) : (
              <>
                <div className="relative w-[90vw] max-w-[320px] h-[55vw] max-h-[240px] bg-gray-100 dark:bg-navy-700 rounded-xl overflow-hidden flex items-center justify-center mb-3 sm:mb-4 shadow-lg border border-gray-200 dark:border-navy-600">
                  {!hasPhoto ? (
                    <video ref={videoRef} width="320" height="240" className="rounded-xl object-cover w-full h-full transition-all duration-300" />
                  ) : (
                    <canvas ref={canvasRef} width="320" height="240" className="rounded-xl object-cover w-full h-full transition-all duration-300" style={{ display: hasPhoto ? 'block' : 'none' }} />
                  )}
                  {/* Hidden canvas for capture */}
                  <canvas ref={canvasRef} width="320" height="240" style={{ display: 'none' }} />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-1 sm:mt-2 w-full justify-center">
                  {!hasPhoto ? (
                    <button
                      onClick={handleCapture}
                      className="flex items-center justify-center gap-2 px-4 py-2 sm:px-6 sm:py-2 bg-gradient-to-r from-blue-600 to-navy-700 text-white rounded-lg shadow-md hover:from-blue-700 hover:to-navy-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-base sm:text-lg font-semibold w-full sm:w-auto"
                    >
                      <MdCameraAlt size={20} /> Capture
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleRetake}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 shadow-md transition font-semibold w-full sm:w-auto"
                        disabled={confirmLoading}
                      >
                        Retake
                      </button>
                      <button
                        onClick={handleConfirm}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md transition font-semibold flex items-center justify-center min-w-[100px] w-full sm:w-auto"
                        disabled={confirmLoading}
                      >
                        {confirmLoading ? (
                          <span className="flex items-center"><span className="loader mr-2"></span>Uploading...</span>
                        ) : (
                          "Confirm"
                        )}
                      </button>
                    </>
                  )}
                </div>
                {photoData && (
                  <div className="mt-4 flex flex-col items-center w-full animate-fadeIn">
                    <span className="text-xs text-gray-500 mb-2">Preview</span>
                    <img
                      src={photoData}
                      alt="Captured"
                      className="rounded-xl shadow-lg border border-gray-300 dark:border-navy-600 w-[60vw] max-w-[200px] h-[40vw] max-h-[150px] object-cover transition-all duration-300"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.5s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .loader {
          border: 2px solid #f3f3f3;
          border-top: 2px solid #3498db;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          animation: spin 1s linear infinite;
          display: inline-block;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default TakePicture; 