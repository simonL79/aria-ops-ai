
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define permission types
export type Permission = 'dashboard.view' | 'dashboard.edit' | 'monitor.access' | 'clients.manage' | 'assistant.interact';

// Define role types
export type Role = 'admin' | 'manager' | 'analyst' | 'viewer';

interface RbacContextType {
  hasPermission: (permission: Permission) => boolean;
  hasRole: (role: Role) => boolean;
  roles: Role[];
  permissions: Permission[];
}

const RbacContext = createContext<RbacContextType>({
  hasPermission: () => false,
  hasRole: () => false,
  roles: [],
  permissions: []
});

export const useRbac = () => useContext(RbacContext);

interface RbacProviderProps {
  children: ReactNode;
}

// Role-protected component wrapper
export const RoleProtected = ({
  roles,
  fallback = null,
  children
}: {
  roles: Role[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}) => {
  const { hasRole } = useRbac();
  
  const canAccess = roles.some(role => hasRole(role));
  
  if (!canAccess) return <>{fallback}</>;
  
  return <>{children}</>;
};

export const RbacProvider = ({ children }: RbacProviderProps) => {
  // In a real app, these would come from your auth provider
  const [roles] = useState<Role[]>(['admin']);
  const [permissions] = useState<Permission[]>([
    'dashboard.view',
    'dashboard.edit',
    'monitor.access',
    'clients.manage',
    'assistant.interact'
  ]);

  const hasPermission = (permission: Permission): boolean => {
    // For demo purposes, admins have all permissions
    if (roles.includes('admin')) return true;
    
    // Otherwise check specific permissions
    return permissions.includes(permission);
  };
  
  const hasRole = (role: Role): boolean => {
    return roles.includes(role);
  };

  return (
    <RbacContext.Provider value={{ hasPermission, hasRole, roles, permissions }}>
      {children}
    </RbacContext.Provider>
  );
};
