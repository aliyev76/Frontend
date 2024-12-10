import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = React.memo(({ children, requiredRole }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || null); 
  const location = useLocation();

  console.log("ProtectedRoute: Checking access...");

  if (!token) {
    console.warn("ProtectedRoute: No token found. Redirecting to /login...");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    console.warn(`ProtectedRoute: Role mismatch. Expected '${requiredRole}', got '${user?.role}'. Redirecting to /Error404...`);
    return <Navigate to="/Error404" replace />;
  }

  console.log("ProtectedRoute: Access granted.");
  return children;
});

export default ProtectedRoute;

