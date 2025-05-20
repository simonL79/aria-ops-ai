import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface SignedInRedirectProps {
  children: ReactNode;
  redirectTo: string;
}

const SignedInRedirect = ({ children, redirectTo }: SignedInRedirectProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  // While authentication state is loading, show a loading indicator
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  // If user is authenticated, redirect them to the specified route
  if (isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }
  
  // Otherwise, render the children components (authentication forms)
  return <>{children}</>;
};

export default SignedInRedirect;
