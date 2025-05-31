import React, { type JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';

interface Props {
  children: JSX.Element;
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Cargando...</p>;

  if (!user) {
    return <Navigate to="/" />; // Redirigir a la página de inicio o a la que estabas
  }

  return children;
};

export default PrivateRoute;