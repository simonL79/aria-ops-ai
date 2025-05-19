import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define permission types
export type Permission = 'dashboard.view' | 'dashboard.edit' | 'monitor.access' | 'clients.manage' | 'assistant.interact';

interface RbacContextType {
  hasPermission: (permission: Permission) => boolean;
  roles: string[];
  permissions: Permission[];
}

const RbacContext = createContext<RbacContextType>({
  hasPermission: () => false,
  roles: [],
  permissions: []
});

export const useRbac = () => useContext(RbacContext);

interface RbacProviderProps {
  children: ReactNode;
}

export const RbacProvider = ({ children }: RbacProviderProps) => {
  // In a real app, these would come from your auth provider
  const [roles] = useState<string[]>(['admin']);
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

  return (
    <RbacContext.Provider value={{ hasPermission, roles, permissions }}>
      {children}
    </RbacContext.Provider>
  );
};
