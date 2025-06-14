import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import Loader from "../src/views/admin/default/components/loader"; // Import the Loader component

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated === null) {
    // Display the Loader component while the authentication state is loading
    return <Loader loading={true} />;
  }

  // If not authenticated, redirect to the appropriate sign-in page
  if (!isAuthenticated) {
    // Check if the current path is related to teacher routes
    if (location.pathname.includes('teacher')) {
      return <Navigate to="/auth/teacher-sign-in" />;
    }
    // Default redirect to admin sign-in
    return <Navigate to="/auth/sign-in" />;
  }

  return children;
};

export default ProtectedRoute;
