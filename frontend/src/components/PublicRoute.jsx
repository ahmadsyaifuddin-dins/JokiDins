import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  // Jika user sudah login, redirect ke halaman profile (atau home)
  return user ? <Navigate to="/" /> : children;
};

export default PublicRoute;
