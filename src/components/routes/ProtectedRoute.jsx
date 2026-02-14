import React from "react";
import { Navigate } from 'react-router-dom';
import { useUser } from '../../UserContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useUser();
  const token = user?.token;

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
