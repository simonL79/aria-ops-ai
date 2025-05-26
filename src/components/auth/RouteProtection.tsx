
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface RouteProtectionProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

const RouteProtection = ({ 
  children, 
  requireAuth = false, 
  requireAdmin = false 
}: RouteProtectionProps) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  // Show loading while checking auth state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Verifying access...</span>
      </div>
    );
  }

  // Redirect to auth if authentication required but user not logged in
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Redirect to dashboard if admin required but user not admin
  if (requireAdmin && (!isAuthenticated || !isAdmin)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default RouteProtection;
