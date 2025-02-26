import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  // Jika user sudah login, redirect ke halaman profile (atau home)
  if (user) {
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/profile" />;
    }
  }
  return children;
};

export default PublicRoute;
