import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const ClientPortalRoute = () => {
  const { isAuthenticated, isLoading, isPortalUser, isPortalLoading, isAdmin, isAdminLoading } = useAuth();
  const location = useLocation();

  if (isLoading || isPortalLoading || isAdminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin h-6 w-6 border-2 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Admins may view portal pages (e.g. shared links) with an expanded view.
  // Non-admin users must be provisioned portal users.
  if (!isAdmin && !isPortalUser) {
    return <Navigate to="/portal/no-access" replace />;
  }

  return <Outlet />;
};

export default ClientPortalRoute;
