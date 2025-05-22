
import { ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export interface ProtectedRouteProps {
  children?: ReactNode;
  redirectTo?: string;
}

const ProtectedRoute = ({ 
  children, 
  redirectTo = "/auth" 
}: ProtectedRouteProps) => {
  const location = useLocation();
  const { isLoading, isAuthenticated } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Authenticating...</span>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }
  
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
