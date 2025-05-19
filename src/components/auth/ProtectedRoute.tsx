
import { ReactNode, useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isSignedIn, isLoaded } = useUser();
  const [showLoading, setShowLoading] = useState(true);
  const location = useLocation();
  
  // Use effect to add a small delay to avoid UI flashing
  useEffect(() => {
    if (isLoaded) {
      // Small timeout to prevent flash
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  // Keep showing loading state until we're sure
  if (!isLoaded || showLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center">
        <Skeleton className="h-12 w-64 mb-4" />
        <Skeleton className="h-4 w-48" />
      </div>
    );
  }

  // Redirect to sign in if not authenticated
  if (!isSignedIn) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
