
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AdminLoginGateway from '@/components/auth/AdminLoginGateway';

const AdminLogin = () => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  // Show loading while auth is being determined
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0B0D]">
        <div className="animate-spin h-8 w-8 border-4 border-amber-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // If already authenticated and admin, redirect to admin dashboard
  if (isAuthenticated && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  // Show the admin login gateway
  return <AdminLoginGateway />;
};

export default AdminLogin;
