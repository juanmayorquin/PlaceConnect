import React, { type JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';

interface Props {
  children: JSX.Element;
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Cargando...</p>;

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;