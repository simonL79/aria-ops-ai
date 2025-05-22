
import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface AuthGuardProps {
  children: ReactNode;
  adminOnly?: boolean;
  redirectTo?: string;
}

/**
 * A component to protect routes that require authentication
 * Optionally restrict to admin-only access
 */
const AuthGuard = ({ 
  children, 
  adminOnly = false, 
  redirectTo = '/admin-login' 
}: AuthGuardProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const location = useLocation();
  
  // The admin email that is allowed to access admin-only routes
  const ADMIN_EMAIL = 'simonlindsay7988@gmail.com';
  
  useEffect(() => {
    // Check authorization whenever auth state changes
    if (!isLoading) {
      if (!isAuthenticated) {
        setIsAuthorized(false);
        toast.error("Authentication required to access this page");
      } else if (adminOnly && user?.email !== ADMIN_EMAIL) {
        setIsAuthorized(false);
        toast.error("Admin access required");
      } else {
        setIsAuthorized(true);
      }
    }
  }, [isAuthenticated, isLoading, user, adminOnly]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <span className="ml-2">Verifying access...</span>
      </div>
    );
  }
  
  // Redirect if not authorized
  if (!isAuthorized) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }
  
  // User is authorized, render the protected content
  return <>{children}</>;
};

export default AuthGuard;
