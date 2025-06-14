import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Loader from "../src/views/admin/default/components/loader"; // Import the Loader component

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // State as null initially for loading
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Introduce a delay before checking localStorage to allow data to be stored
    const delay = 1000; // Delay in milliseconds (e.g., 1 second)

    const timer = setTimeout(() => {
      const edupay = localStorage.getItem("Edupay");

      if (edupay) {
        setIsAuthenticated(true); // Set authentication status if login details exist
      } else {
        setIsAuthenticated(false); // Not authenticated
      }
    }, delay);

    // Clear the timer on component unmount to prevent memory leaks
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isAuthenticated === false) {
      // Check if we're on a teacher route
      if (location.pathname.includes('teacher')) {
        navigate("/auth/teacher-sign-in");
      } else {
        navigate("/auth/sign-in");
      }
    } else if (isAuthenticated === true) {
      // If authenticated and on a sign-in page, redirect to appropriate dashboard
      if (location.pathname === "/auth/sign-in") {
        navigate("/admin/default");
      } else if (location.pathname === "/auth/teacher-sign-in") {
        navigate("/admin/teacher-dashboard");
      }
    }
  }, [isAuthenticated, navigate, location.pathname]);

  return (
    <AuthContext.Provider value={{ isAuthenticated }}>
      {isAuthenticated === null ? <Loader loading={true} /> : children} {/* Show loader until authentication is checked */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
