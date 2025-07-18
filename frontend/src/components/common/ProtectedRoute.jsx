import React from 'react';
// import { Navigate, Outlet } from 'react-router-dom';
// import { useAuth } from '../../hooks/useAuth';

// /**
//  * ProtectedRoute component to guard private routes.
//  * Supports all roles (user, captain, admin).
//  * Redirects to login page if user is not authenticated.
//  */
// const ProtectedRoute = ({ allowedRoles }) => {
//   const { isAuthenticated, userRole } = useAuth();

//   if (!isAuthenticated) {
//     // Redirect to login based on role
//     if (allowedRoles.includes('user')) return <Navigate to="/user-login" replace />;
//     if (allowedRoles.includes('captain')) return <Navigate to="/captain/login" replace />;
//     if (allowedRoles.includes('admin')) return <Navigate to="/admin" replace />;
//     return <Navigate to="/" replace />;
//   }

//   // If role not allowed, redirect to their respective dashboard or home
//   if (!allowedRoles.includes(userRole)) {
//     if (userRole === 'user') return <Navigate to="/user/dashboard" replace />;
//     if (userRole === 'captain') return <Navigate to="/captain/dashboard" replace />;
//     if (userRole === 'admin') return <Navigate to="/admin/dashboard" replace />;
//   }

//   return <Outlet />;
// };

// export default ProtectedRoute;




import useAuth from '../../utils/auth'; // ✅ default import

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <div>You are not authorized to view this page.</div>;
  }

  return children;
};

export default ProtectedRoute;
