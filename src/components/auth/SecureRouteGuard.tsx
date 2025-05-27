
import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Loader2, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SecureRouteGuardProps {
  children: ReactNode;
  requireAdmin?: boolean;
  allowedRoles?: string[];
  redirectTo?: string;
}

const SecureRouteGuard = ({ 
  children, 
  requireAdmin = true, 
  allowedRoles = [],
  redirectTo = '/admin/login' 
}: SecureRouteGuardProps) => {
  const { isAuthenticated, isLoading, isAdmin, user } = useAuth();
  const location = useLocation();

  // Log access attempts
  useEffect(() => {
    const logAccess = async () => {
      if (!isLoading) {
        try {
          await supabase.from('admin_action_logs').insert({
            action: 'route_access_attempt',
            success: isAuthenticated && (requireAdmin ? isAdmin : true),
            details: `Attempted to access ${location.pathname}`,
            ip_address: 'client-side',
            user_agent: navigator.userAgent,
            email_attempted: user?.email || 'unknown'
          });
        } catch (error) {
          console.error('Failed to log route access:', error);
        }
      }
    };

    logAccess();
  }, [isLoading, isAuthenticated, isAdmin, location.pathname, user?.email, requireAdmin]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-400 mx-auto" />
          <div className="text-white">
            <div className="font-semibold">Verifying Security Clearance</div>
            <div className="text-sm text-gray-400">Authenticating admin access...</div>
          </div>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    toast.error('Authentication required for admin access');
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Redirect if admin access required but user is not admin
  if (requireAdmin && !isAdmin) {
    toast.error('Admin privileges required for this area');
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role-based access if specific roles are required
  if (allowedRoles.length > 0) {
    // This would require role checking logic - placeholder for future role expansion
    const hasRequiredRole = true; // Implement role checking here
    
    if (!hasRequiredRole) {
      toast.error('Insufficient permissions for this area');
      return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }
  }

  // User is authorized - render protected content
  return <>{children}</>;
};

export default SecureRouteGuard;
