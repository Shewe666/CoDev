import React from "react";
import { Navigate } from "react-router-dom";

// Simple auth guard - checks if JWT token exists in localStorage
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;
