
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export type Role = 'admin' | 'manager' | 'analyst' | 'user' | 'security';

interface RbacContextType {
  roles: Role[];
  hasPermission: (requiredRoles: Role | Role[]) => boolean;
  isLoading: boolean;
}

const RbacContext = createContext<RbacContextType>({
  roles: ['user'],
  hasPermission: () => false,
  isLoading: true,
});

export const RbacProvider = ({ children, initialRoles = ['user'] }: { children: React.ReactNode, initialRoles?: Role[] }) => {
  const { isAuthenticated, userId } = useAuth();
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (isAuthenticated && userId) {
      fetchUserRoles(userId);
    } else {
      setRoles(['user']);
      setIsLoading(false);
    }
  }, [isAuthenticated, userId]);
  
  const fetchUserRoles = async (userId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);
      
      if (error) {
        console.error('Error fetching user roles:', error);
        setRoles(['user']); // Default to user role on error
      } else if (data && data.length > 0) {
        const userRoles = data.map(r => r.role as Role);
        setRoles([...userRoles, 'user']); // Always include 'user' role
        console.log('User roles:', userRoles);
      } else {
        setRoles(['user']); // Default to user role if no roles found
      }
    } catch (error) {
      console.error('Error fetching user roles:', error);
      setRoles(['user']);
    } finally {
      setIsLoading(false);
    }
  };
  
  const hasPermission = (requiredRoles: Role | Role[]) => {
    if (!requiredRoles || (Array.isArray(requiredRoles) && requiredRoles.length === 0)) {
      return true;
    }
    
    const rolesToCheck = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    
    // Check if user has at least one of the required roles
    return roles.some(role => rolesToCheck.includes(role));
  };
  
  return (
    <RbacContext.Provider value={{ roles, hasPermission, isLoading }}>
      {children}
    </RbacContext.Provider>
  );
};

export const useRbac = () => useContext(RbacContext);

interface ProtectedProps {
  roles: Role | Role[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const Protected = ({ roles, fallback, children }: ProtectedProps) => {
  const { hasPermission, isLoading } = useRbac();
  
  if (isLoading) {
    return <div>Loading permissions...</div>;
  }
  
  if (hasPermission(roles)) {
    return <>{children}</>;
  }
  
  return fallback ? <>{fallback}</> : null;
};

// Add RoleProtected as an alias of Protected for backward compatibility
export const RoleProtected = Protected;

export default useRbac;
