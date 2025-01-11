import React, { useState, useEffect } from "react";

const Alert = ({ type = "info", message, isOpen, onClose, duration = 3000 }) => {
  const [visible, setVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!visible) return null;

  const typeStyles = {
    success: "bg-green-100 text-green-800 border-green-500",
    error: "bg-red-100 text-red-800 border-red-500",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-500",
    info: "bg-blue-100 text-blue-800 border-blue-500",
  };

  const icon = {
    success: "✔️",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-60 bg-black/50"
    >
      <div
        className={`flex items-center justify-between w-[90%] max-w-md p-6 rounded-lg shadow-lg transition-transform duration-300 transform ${
          isOpen ? "translate-y-0" : "-translate-y-10 opacity-0"
        } ${typeStyles[type]} dark:bg-opacity-70 border dark:border-opacity-40`}
      >
        {/* Icon */}
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon[type]}</span>
          <span className="text-sm font-medium">{message}</span>
        </div>

        {/* Close Button */}
        <button
          className="ml-4 text-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          onClick={() => {
            setVisible(false);
            if (onClose) onClose();
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Alert;
