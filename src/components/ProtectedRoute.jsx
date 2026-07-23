import React from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

/**
 * Wrap a dashboard route with this to require login (and optionally a specific role).
 * <ProtectedRoute role="Student"><StudentDashboard /></ProtectedRoute>
 */
const ProtectedRoute = ({ children, role }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-500">Loading your session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {
    // Logged in, but wrong role for this route — send them to their own dashboard.
    const fallback = {
      Student: '/studentdashboard',
      Agent: '/agentdashboard',
      Agency: '/agencydashboard',
      Admin: '/admindashboard',
      Representative: '/representativedashboard',
    }[user?.role] || '/';
    return <Navigate to={fallback} replace />;
  }

  return children;
};

export default ProtectedRoute;
