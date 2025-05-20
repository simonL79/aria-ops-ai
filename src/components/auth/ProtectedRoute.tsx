
import { ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AccessDenied } from "@/components/ui/access-denied";
import { useRbac, Role } from "@/hooks/useRbac";

export interface ProtectedRouteProps {
  children?: ReactNode;
  requiredRole?: Role | Role[];
  redirectTo?: string;
}

const ProtectedRoute = ({ 
  children, 
  requiredRole, 
  redirectTo = "/auth" 
}: ProtectedRouteProps) => {
  const location = useLocation();
  const { user, isLoading, isAuthenticated } = useAuth();
  const { hasPermission } = useRbac();
  
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      <span className="ml-2">Authenticating...</span>
    </div>;
  }
  
  if (!user || !isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }
  
  // If role check is required and user doesn't have the role
  if (requiredRole && !hasPermission(requiredRole)) {
    return <AccessDenied />;
  }
  
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
