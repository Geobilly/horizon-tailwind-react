import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import Loader from "../src/views/admin/default/components/loader"; // Import the Loader component

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === null) {
    // Display the Loader component while the authentication state is loading
    return <Loader loading={true} />;
  }

  return isAuthenticated ? children : <Navigate to="/auth/sign-in" />;
};

export default ProtectedRoute;
