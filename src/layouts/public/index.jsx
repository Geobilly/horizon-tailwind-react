import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import FaceRecognition from "views/public/FaceRecognition";

export default function PublicLayout() {
  document.documentElement.dir = "ltr";
  return (
    <div className="relative min-h-screen w-full bg-gray-50 dark:bg-[#0d1b12]">
      <main className="relative z-10 mx-auto min-h-screen">
        <Routes>
          <Route path="face-recognition" element={<FaceRecognition />} />
          <Route path="/" element={<Navigate to="/public/face-recognition" replace />} />
        </Routes>
      </main>
    </div>
  );
}