
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Shield, AlertTriangle } from 'lucide-react';

interface SecureRouteGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const SecureRouteGuard = ({ children, requiredRole = 'admin' }: SecureRouteGuardProps) => {
  const { user, isAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    checkAccess();
  }, [user, isAdmin]);

  const checkAccess = async () => {
    try {
      if (!user) {
        setHasAccess(false);
        setIsLoading(false);
        return;
      }

      // Log access attempt
      await supabase.from('activity_logs').insert({
        action: 'route_access_attempt',
        details: `User ${user.email} attempted to access secured route requiring ${requiredRole}`,
        entity_type: 'security',
        user_id: user.id,
        user_email: user.email
      });

      // Check if user has required permissions
      if (requiredRole === 'admin' && isAdmin) {
        setHasAccess(true);
        
        // Log successful access
        await supabase.from('activity_logs').insert({
          action: 'route_access_granted',
          details: `Admin access granted to ${user.email}`,
          entity_type: 'security',
          user_id: user.id,
          user_email: user.email
        });
      } else {
        setHasAccess(false);
        
        // Log denied access
        await supabase.from('activity_logs').insert({
          action: 'route_access_denied',
          details: `Access denied to ${user.email} - insufficient permissions`,
          entity_type: 'security',
          user_id: user.id,
          user_email: user.email
        });
      }
    } catch (error) {
      console.error('Access check failed:', error);
      setHasAccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-pulse" />
          <p className="text-white text-lg">Verifying Security Clearance...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-slate-400 mb-6">
            You don't have permission to access this area. Administrator privileges required.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default SecureRouteGuard;
