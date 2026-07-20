import React, { useState, useRef, useEffect } from "react";

const FaceRecognition = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [detectionStatus, setDetectionStatus] = useState("Start camera to begin");
  const [capturedImage, setCapturedImage] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [stableCount, setStableCount] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const REQUIRED_STABLE_FRAMES = 10;
  const stableFrameRef = useRef(0);
  const detectionIntervalRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => {
      clearInterval(timer);
      stopCamera();
      if (detectionIntervalRef.current) clearInterval(detectionIntervalRef.current);
    };
  }, []);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      setDetectionStatus("Requesting camera access...");
      setCapturedImage(null);
      setMatchResult(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
        },
      });

      streamRef.current = stream;
      setIsCameraActive(true);
      setIsLoading(false);
      setDetectionStatus("Position your face in the frame");

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch(console.error);
        };
      }

      // Simulate face detection after camera starts
      setTimeout(() => startFaceDetection(), 1000);
    } catch (error) {
      console.error("Camera error:", error);
      let msg = "Unable to access camera. ";
      if (error.name === "NotAllowedError") msg += "Please allow camera permissions.";
      else if (error.name === "NotFoundError") msg += "No camera found.";
      else msg += "Please check your camera settings.";
      setDetectionStatus(msg);
      setIsLoading(false);
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
        track.enabled = false;
      });
      streamRef.current = null;
    }
    setIsCameraActive(false);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
  };

  const startFaceDetection = () => {
    if (detectionIntervalRef.current) clearInterval(detectionIntervalRef.current);
    stableFrameRef.current = 0;

    detectionIntervalRef.current = setInterval(() => {
      if (!isCameraActive || capturedImage || isAuthenticating) return;

      // Simulate face detection with random detection
      const detected = Math.random() > 0.4;
      if (detected) {
        stableFrameRef.current += 1;
        setStableCount(stableFrameRef.current);
        setFaceDetected(true);
        setDetectionStatus(`Face stable (${stableFrameRef.current}/${REQUIRED_STABLE_FRAMES})`);

        if (stableFrameRef.current >= REQUIRED_STABLE_FRAMES) {
          stableFrameRef.current = 0;
          setStableCount(0);
          captureFace();
        }
      } else {
        stableFrameRef.current = 0;
        setFaceDetected(false);
        setDetectionStatus("Position your face in the frame");
      }
    }, 200);
  };

  const captureFace = () => {
    if (!videoRef.current || capturedImage || isAuthenticating) return;

    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }

    setIsAuthenticating(true);
    setDetectionStatus("Face detected! Capturing...");

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL("image/png");
    setCapturedImage(imageData);
    stopCamera();
    setDetectionStatus("Image captured! Authenticating...");

    // Simulate authentication delay
    setTimeout(() => {
      setDetectionStatus("Authenticating face...");
      setTimeout(() => {
        setIsAuthenticating(false);
        const matched = Math.random() > 0.3;
        setMatchResult({
          matched,
          confidence: Math.floor(Math.random() * 30) + 70,
          name: "John Doe",
          studentId: "STU-2024-0042",
          department: "Computer Science",
          level: "300",
        });
        if (matched) {
          setDetectionStatus("Face recognized!");
          showToastNotification("Face recognized successfully!", "success");
        } else {
          setDetectionStatus("Face not recognized");
          showToastNotification("Face not recognized in the database.", "error");
        }
      }, 1500);
    }, 1000);
  };

  const showToastNotification = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const resetAll = () => {
    setCapturedImage(null);
    setMatchResult(null);
    setFaceDetected(false);
    setIsAuthenticating(false);
    setStableCount(0);
    stableFrameRef.current = 0;
    setDetectionStatus("Start camera to begin");
    if (streamRef.current) stopCamera();
    startCamera();
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
  };

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-gray-50 dark:bg-[#0d1b12] text-gray-900 dark:text-gray-100 font-dm transition-colors duration-200">
      {/* Header */}
      <header className="flex items-center justify-between px-6 sm:px-8 py-4 sm:py-6 z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#22c55e]/20 text-[#22c55e]">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Face Recognition
          </h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#22c55e]/10 hover:bg-[#22c55e]/20 dark:bg-[#22c55e]/20 dark:hover:bg-[#22c55e]/30 rounded-lg shadow-sm border border-[#22c55e]/20 text-[#22c55e] transition-all active:scale-95">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5z" />
            </svg>
            <span className="text-sm font-semibold hidden sm:inline">QR Scan</span>
          </button>
          <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white dark:bg-white/5 rounded-full shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">Online</span>
          </div>
          <div className="flex items-center justify-center w-10 h-10 bg-white dark:bg-white/5 rounded-full shadow-sm border border-gray-100 dark:border-gray-800">
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 7.5l9-4.5 9 4.5M3.75 16.5l9 4.5 9-4.5M3.75 12l9 4.5 9-4.5" />
            </svg>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 -mt-8 sm:-mt-12">
        <div className="relative flex flex-col items-center w-full max-w-[640px]">
          {/* Status Badge */}
          <div
            className={`absolute -top-5 z-20 flex items-center gap-2 px-5 sm:px-6 py-2 rounded-full shadow-lg border transition-colors ${
              capturedImage
                ? "bg-[#22c55e]/20 border-[#22c55e]/40 text-[#22c55e]"
                : faceDetected
                  ? "bg-[#22c55e]/20 border-[#22c55e]/40 text-[#22c55e]"
                  : "bg-white dark:bg-[#1a2e1f] border-[#22c55e]/20 text-gray-800 dark:text-gray-100"
            }`}
          >
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                capturedImage
                  ? "bg-[#22c55e]"
                  : faceDetected
                    ? "bg-[#22c55e] animate-pulse"
                    : "bg-[#22c55e] animate-pulse"
              }`}
            />
            <span className="text-xs sm:text-sm font-bold tracking-wide uppercase">
              {capturedImage
                ? "Face Captured"
                : faceDetected
                  ? "Face Detected"
                  : "Scanning Face"}
            </span>
          </div>

          {/* Camera Frame */}
          <div className="relative w-full aspect-[4/3] sm:aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-[#1a2e1f] bg-gray-900">
            {/* Video or Captured Image */}
            {capturedImage ? (
              <div className="w-full h-full relative">
                <img
                  src={capturedImage}
                  alt="Captured face"
                  className="w-full h-full object-cover"
                  style={{ transform: "scaleX(-1)" }}
                />
                {isAuthenticating && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-16 h-16 border-4 border-[#22c55e]/30 border-t-[#22c55e] rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-lg font-bold">Authenticating...</p>
                      <p className="text-sm text-white/60">{detectionStatus}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  style={{ transform: "scaleX(-1)" }}
                />

                {/* Loading overlay */}
                {isLoading && (
                  <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 border-4 border-[#22c55e]/30 border-t-[#22c55e] rounded-full animate-spin" />
                      <p className="text-white/70 text-sm">{detectionStatus}</p>
                    </div>
                  </div>
                )}

                {/* Camera off state */}
                {!isCameraActive && !isLoading && (
                  <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                      <svg className="w-16 h-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                      </svg>
                      <p className="text-white/50 text-sm">Camera is off</p>
                    </div>
                  </div>
                )}
              </>
            )}

            <canvas ref={canvasRef} className="hidden" />

            {/* Overlay: Viewfinder Corners */}
            {!capturedImage && isCameraActive && (
              <div className="absolute inset-0 p-6 sm:p-8 pointer-events-none">
                <div
                  className={`w-full h-full relative border-2 rounded-2xl transition-all duration-300 ${
                    faceDetected
                      ? "border-[#22c55e] shadow-lg shadow-[#22c55e]/30"
                      : "border-white/30"
                  }`}
                >
                  {/* Corner brackets */}
                  <div
                    className={`absolute -top-0.5 -left-0.5 w-14 h-14 sm:w-16 sm:h-16 border-t-4 border-l-4 rounded-tl-xl transition-colors ${
                      faceDetected ? "border-[#22c55e]" : "border-white/50"
                    }`}
                  />
                  <div
                    className={`absolute -top-0.5 -right-0.5 w-14 h-14 sm:w-16 sm:h-16 border-t-4 border-r-4 rounded-tr-xl transition-colors ${
                      faceDetected ? "border-[#22c55e]" : "border-white/50"
                    }`}
                  />
                  <div
                    className={`absolute -bottom-0.5 -left-0.5 w-14 h-14 sm:w-16 sm:h-16 border-b-4 border-l-4 rounded-bl-xl transition-colors ${
                      faceDetected ? "border-[#22c55e]" : "border-white/50"
                    }`}
                  />
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 w-14 h-14 sm:w-16 sm:h-16 border-b-4 border-r-4 rounded-br-xl transition-colors ${
                      faceDetected ? "border-[#22c55e]" : "border-white/50"
                    }`}
                  />
                </div>
              </div>
            )}

            {/* Face Guide Icon */}
            {!capturedImage && isCameraActive && !faceDetected && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <svg className="w-24 h-24 sm:w-32 sm:h-32 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
            )}
          </div>

          {/* Text Feedback */}
          <div className="mt-6 sm:mt-8 text-center space-y-2">
            <h2
              className={`text-2xl sm:text-3xl font-bold tracking-tight transition-colors ${
                capturedImage
                  ? "text-[#22c55e]"
                  : faceDetected
                    ? "text-[#22c55e]"
                    : "text-gray-900 dark:text-white"
              }`}
            >
              {capturedImage
                ? isAuthenticating
                  ? "Authenticating..."
                  : matchResult
                    ? matchResult.matched
                      ? "Face Recognized!"
                      : "No Match Found"
                    : "Face Captured!"
                : faceDetected
                  ? "Face detected!"
                  : "Looking for face..."}
            </h2>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
              {detectionStatus}
            </p>

            {/* Stability Progress Bar */}
            {!capturedImage && isCameraActive && (
              <div className="mt-3 w-56 sm:w-64 mx-auto">
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#22c55e] transition-all duration-200 rounded-full"
                    style={{
                      width: `${Math.min(100, Math.round((stableCount / REQUIRED_STABLE_FRAMES) * 100))}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Stability: {stableCount}/{REQUIRED_STABLE_FRAMES}
                </p>
              </div>
            )}
          </div>

          {/* Result Card (shows after authentication) */}
          {matchResult && !isAuthenticating && (
            <div className="mt-6 w-full">
              <div
                className={`rounded-2xl p-5 sm:p-6 border transition-all duration-500 ${
                  matchResult.matched
                    ? "bg-[#22c55e]/10 border-[#22c55e]/30"
                    : "bg-red-500/10 border-red-400/30"
                }`}
              >
                <div className="flex items-center justify-between mb-5">
                  <div
                    className={`flex items-center gap-3 px-4 py-2 rounded-xl ${
                      matchResult.matched
                        ? "bg-[#22c55e]/20 text-[#22c55e]"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        matchResult.matched ? "bg-[#22c55e] animate-pulse" : "bg-red-400"
                      }`}
                    />
                    <span className="font-semibold text-sm sm:text-base">
                      {matchResult.matched ? "MATCH FOUND" : "NO MATCH"}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 dark:text-gray-400 text-xs">Confidence</p>
                    <p
                      className={`text-lg sm:text-xl font-bold ${
                        matchResult.matched ? "text-[#22c55e]" : "text-red-400"
                      }`}
                    >
                      {matchResult.confidence}%
                    </p>
                  </div>
                </div>

                {matchResult.matched && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white dark:bg-white/5 rounded-xl p-3 sm:p-4">
                      <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Full Name</p>
                      <p className="text-gray-900 dark:text-white font-medium text-sm sm:text-base">
                        {matchResult.name}
                      </p>
                    </div>
                    <div className="bg-white dark:bg-white/5 rounded-xl p-3 sm:p-4">
                      <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Student ID</p>
                      <p className="text-gray-900 dark:text-white font-medium text-sm sm:text-base">
                        {matchResult.studentId}
                      </p>
                    </div>
                    <div className="bg-white dark:bg-white/5 rounded-xl p-3 sm:p-4">
                      <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Department</p>
                      <p className="text-gray-900 dark:text-white font-medium text-sm sm:text-base">
                        {matchResult.department}
                      </p>
                    </div>
                    <div className="bg-white dark:bg-white/5 rounded-xl p-3 sm:p-4">
                      <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Level</p>
                      <p className="text-gray-900 dark:text-white font-medium text-sm sm:text-base">
                        {matchResult.level}
                      </p>
                    </div>
                  </div>
                )}

                {!matchResult.matched && (
                  <div className="bg-white dark:bg-white/5 rounded-xl p-4 text-center">
                    <p className="text-red-400/80 text-sm">
                      Face does not match any records in the database.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer Actions */}
      <footer className="w-full px-6 sm:px-8 pb-4 sm:pb-6 pt-4">
        <div className="max-w-[960px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
          {/* Date/Time */}
          <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex flex-col text-sm leading-tight">
              <span className="font-bold text-gray-900 dark:text-gray-200">{formatTime(currentTime)}</span>
              <span>{formatDate(currentTime)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 sm:gap-4 w-full sm:w-auto">
            {capturedImage ? (
              <button
                onClick={resetAll}
                className="flex-1 sm:flex-none flex items-center justify-center gap-3 h-14 sm:h-16 px-6 sm:px-8 rounded-2xl bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold shadow-md transition-all active:scale-95"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                </svg>
                <span>Scan Again</span>
              </button>
            ) : (
              <>
                {!isCameraActive ? (
                  <button
                    onClick={startCamera}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-3 h-14 sm:h-16 px-6 sm:px-8 rounded-2xl bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold shadow-md transition-all active:scale-95"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                      <circle cx="12" cy="12" r="4.5" />
                    </svg>
                    <span>Start Camera</span>
                  </button>
                ) : (
                  <div className="flex-1 sm:flex-none flex items-center justify-center h-14 sm:h-16 px-6 sm:px-8 rounded-2xl bg-gray-100 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
                      Auto-capture active
                    </div>
                  </div>
                )}
                <button
                  onClick={stopCamera}
                  className="flex items-center justify-center h-14 sm:h-16 px-4 sm:px-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium shadow-sm transition-all active:scale-95 hover:bg-gray-50 dark:hover:bg-white/10"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-50 animate-slide-in">
          <div
            className={`flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl border ${
              toastType === "success"
                ? "bg-white dark:bg-[#1a2e1f] border-[#22c55e]/30 text-[#22c55e]"
                : "bg-white dark:bg-[#2e1a1a] border-red-400/30 text-red-400"
            }`}
          >
            {toastType === "success" ? (
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            )}
            <p className="text-sm font-semibold">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Footer Component */}
      <div className="px-6 sm:px-8 pb-4 sm:pb-6">
        <div className="max-w-[960px] mx-auto">
          <p className="text-xs text-gray-400 dark:text-gray-600 text-center">
            Secure facial recognition system · End-to-end encrypted
          </p>
        </div>
      </div>
    </div>
  );
};

export default FaceRecognition;