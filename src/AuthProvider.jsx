import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../src/views/admin/default/components/loader"; // Import the Loader component

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // State as null initially for loading
  const navigate = useNavigate();

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
    // Redirect to sign-in page if not authenticated
    if (isAuthenticated === false) {
      navigate("/auth/sign-in");
    } else if (isAuthenticated === true && window.location.pathname === "/auth/sign-in") {
      // If the user is authenticated and on the sign-in page, redirect to /admin/default
      navigate("/admin/default");
    }
  }, [isAuthenticated, navigate]);

  return (
    <AuthContext.Provider value={{ isAuthenticated }}>
      {isAuthenticated === null ? <Loader loading={true} /> : children} {/* Show loader until authentication is checked */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
