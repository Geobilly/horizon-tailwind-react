import React, { useRef, useState } from "react";
import { MdCameraAlt, MdArrowBack, MdClose } from "react-icons/md";

const TakePicture = ({ onCapture, onClose, onBack }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [photoData, setPhotoData] = useState(null);
  const [error, setError] = useState("");

  const startCamera = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        })
        .catch((err) => {
          setError("Unable to access camera. Please check your device permissions.");
        });
    } else {
      setError("Camera not supported in this browser.");
    }
  };

  React.useEffect(() => {
    setError("");
    setHasPhoto(false);
    setPhotoData(null);
    startCamera();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    const width = 320;
    const height = 240;
    const context = canvasRef.current.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, width, height);
    const dataUrl = canvasRef.current.toDataURL("image/png");
    setPhotoData(dataUrl);
    setHasPhoto(true);
    // Stop the camera stream after capture
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    if (onCapture) onCapture(dataUrl);
  };

  const handleRetake = () => {
    setHasPhoto(false);
    setPhotoData(null);
    startCamera();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-navy-900/80 to-blue-400/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-navy-800 rounded-2xl shadow-2xl p-6 w-[95%] max-w-[420px] flex flex-col items-center animate-fadeIn">
        <div className="flex justify-between items-center w-full mb-4">
          <button
            onClick={onBack || onClose}
            className="text-navy-700 dark:text-white hover:bg-gray-100 dark:hover:bg-navy-700 p-2 rounded-full transition"
            aria-label="Back"
          >
            <MdArrowBack size={24} />
          </button>
          <h3 className="text-xl font-bold text-navy-700 dark:text-white flex-1 text-center">Take Student Picture</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full transition"
            aria-label="Close"
          >
            <MdClose size={24} />
          </button>
        </div>
        {error ? (
          <div className="text-red-500 mb-4 text-center">{error}</div>
        ) : (
          <>
            <div className="relative w-[320px] h-[240px] bg-gray-100 dark:bg-navy-700 rounded-xl overflow-hidden flex items-center justify-center mb-4 shadow-lg border border-gray-200 dark:border-navy-600">
              {!hasPhoto ? (
                <video ref={videoRef} width="320" height="240" className="rounded-xl object-cover transition-all duration-300" />
              ) : (
                <canvas ref={canvasRef} width="320" height="240" className="rounded-xl object-cover transition-all duration-300" style={{ display: hasPhoto ? 'block' : 'none' }} />
              )}
              {/* Hidden canvas for capture */}
              <canvas ref={canvasRef} width="320" height="240" style={{ display: 'none' }} />
            </div>
            <div className="flex gap-4 mt-2 w-full justify-center">
              {!hasPhoto ? (
                <button
                  onClick={handleCapture}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-navy-700 text-white rounded-lg shadow-md hover:from-blue-700 hover:to-navy-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-lg font-semibold"
                >
                  <MdCameraAlt size={22} /> Take Picture
                </button>
              ) : (
                <>
                  <button
                    onClick={handleRetake}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 shadow-md transition font-semibold"
                  >
                    Retake
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md transition font-semibold"
                  >
                    Done
                  </button>
                </>
              )}
            </div>
            {photoData && (
              <div className="mt-6 flex flex-col items-center w-full animate-fadeIn">
                <span className="text-xs text-gray-500 mb-2">Preview</span>
                <img
                  src={photoData}
                  alt="Captured"
                  className="rounded-xl shadow-lg border border-gray-300 dark:border-navy-600 w-[200px] h-[150px] object-cover transition-all duration-300"
                />
              </div>
            )}
          </>
        )}
      </div>
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.5s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default TakePicture; 