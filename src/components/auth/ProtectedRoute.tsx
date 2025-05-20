
import { ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AccessDenied } from "@/components/ui/access-denied";
import { useRbac } from "@/hooks/useRbac";

export interface ProtectedRouteProps {
  children?: ReactNode;
  requiredRole?: string;
  redirectTo?: string;
}

const ProtectedRoute = ({ 
  children, 
  requiredRole, 
  redirectTo = "/auth" 
}: ProtectedRouteProps) => {
  const location = useLocation();
  const { user, isLoading } = useAuth();
  const { hasPermission } = useRbac();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }
  
  // If role check is required and user doesn't have the role
  if (requiredRole && !hasPermission(requiredRole)) {
    return <AccessDenied />;
  }
  
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
