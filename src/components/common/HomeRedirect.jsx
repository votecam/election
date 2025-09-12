import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const HomeRedirect = () => {
  const { user, isAdmin } = useAuth();

  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user is a limited admin, redirect to dashboard (default)
  if (isAdmin()) {
    return <Navigate to="/app/dashboard" replace />;
  }

  // If user is not a limited admin (super admin or others), redirect to reports
  return <Navigate to="/app/reports/all" replace />;
};

export default HomeRedirect;
