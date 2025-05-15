import React, { type JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';

const AdminRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <p>Cargando...</p>;
  return user?.role === 'Admin' ? children : <Navigate to="/" replace />;
};

export default AdminRoute;