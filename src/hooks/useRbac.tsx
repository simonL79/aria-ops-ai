
import React, { createContext, useContext, useState } from 'react';

export type Role = 'admin' | 'manager' | 'analyst' | 'user';

interface RbacContextType {
  roles: Role[];
  hasPermission: (requiredRoles: Role | Role[]) => boolean;
}

const RbacContext = createContext<RbacContextType>({
  roles: ['user'],
  hasPermission: () => false,
});

export const RbacProvider = ({ children, initialRoles = ['user'] }: { children: React.ReactNode, initialRoles?: Role[] }) => {
  const [roles] = useState<Role[]>(initialRoles);
  
  const hasPermission = (requiredRoles: Role | Role[]) => {
    if (!requiredRoles || (Array.isArray(requiredRoles) && requiredRoles.length === 0)) {
      return true;
    }
    
    const rolesToCheck = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    
    // Check if user has at least one of the required roles
    return roles.some(role => rolesToCheck.includes(role));
  };
  
  return (
    <RbacContext.Provider value={{ roles, hasPermission }}>
      {children}
    </RbacContext.Provider>
  );
};

export const useRbac = () => useContext(RbacContext);

interface ProtectedProps {
  roles: Role[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const Protected = ({ roles, fallback, children }: ProtectedProps) => {
  const { hasPermission } = useRbac();
  
  if (hasPermission(roles)) {
    return <>{children}</>;
  }
  
  return fallback ? <>{fallback}</> : null;
};

// Add RoleProtected as an alias of Protected for backward compatibility
export const RoleProtected = Protected;

export default useRbac;
