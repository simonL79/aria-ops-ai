
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AdminLoginGateway from '@/components/auth/AdminLoginGateway';

const AdminLogin = () => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  // Show loading while checking auth state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        <span className="ml-2 text-white">Checking authentication...</span>
      </div>
    );
  }

  // If already authenticated and admin, redirect to admin dashboard
  if (isAuthenticated && isAdmin) {
    console.log('🔄 Already authenticated admin, redirecting to dashboard');
    return <Navigate to="/admin" replace />;
  }

  // If authenticated but not admin, redirect to regular dashboard
  if (isAuthenticated && !isAdmin) {
    console.log('🔄 Authenticated but not admin, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  const handleLoginComplete = (success: boolean) => {
    console.log('🔄 Login complete, success:', success);
    if (success) {
      // The AdminLoginGateway handles the redirect now
    }
  };

  return <AdminLoginGateway onComplete={handleLoginComplete} />;
};

export default AdminLogin;
