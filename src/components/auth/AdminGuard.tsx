
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface AdminGuardProps {
  children: ReactNode;
  redirectTo?: string;
}

const AdminGuard = ({ children, redirectTo = '/auth' }: AdminGuardProps) => {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();
  
  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Verifying admin access...</span>
      </div>
    );
  }
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }
  
  // Redirect if not admin
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // User is authenticated and is admin
  return <>{children}</>;
};

export default AdminGuard;
