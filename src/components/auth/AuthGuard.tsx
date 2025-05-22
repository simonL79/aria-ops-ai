
import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

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
  redirectTo = '/auth' 
}: AuthGuardProps) => {
  const { isAuthenticated, isLoading, user, isAdmin } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error("Authentication required to access this page");
    } else if (!isLoading && adminOnly && !isAdmin) {
      toast.error("Admin access required");
    }
  }, [isAuthenticated, isLoading, adminOnly, isAdmin]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Verifying access...</span>
      </div>
    );
  }
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }
  
  // Redirect if admin access is required but user is not an admin
  if (adminOnly && !isAdmin) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }
  
  // User is authorized, render the protected content
  return <>{children}</>;
};

export default AuthGuard;
