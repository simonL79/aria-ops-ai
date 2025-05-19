
import { useUser } from "@clerk/clerk-react";
import { useState, useEffect, createContext, useContext, ReactNode } from "react";

// Define the available roles in the system
export type UserRole = 'user' | 'analyst' | 'manager' | 'admin';

interface RbacContextType {
  userRoles: UserRole[];
  isLoading: boolean;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  hasAllRoles: (roles: UserRole[]) => boolean;
}

// Create the context
const RbacContext = createContext<RbacContextType | undefined>(undefined);

// Provider component
export const RbacProvider = ({ children }: { children: ReactNode }) => {
  const { user, isLoaded: isUserLoaded } = useUser();
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load roles when user data is available
  useEffect(() => {
    const loadRoles = async () => {
      if (!isUserLoaded || !user) {
        setUserRoles([]);
        setIsLoading(false);
        return;
      }
      
      try {
        // In a real implementation, this would fetch roles from a backend API
        // For now, we'll simulate that based on metadata from Clerk
        
        // Default role
        const roles: UserRole[] = ['user'];
        
        // Check for role in public metadata (user.publicMetadata)
        const userMetadataRoles = user.publicMetadata?.roles;
        if (userMetadataRoles && Array.isArray(userMetadataRoles)) {
          userMetadataRoles.forEach(role => {
            if (isValidRole(role as string)) {
              roles.push(role as UserRole);
            }
          });
        }
        
        // Check for additional roles based on email domain (for demo purposes)
        if (user.emailAddresses.some(email => email.emailAddress.endsWith('@admin.aria.com'))) {
          roles.push('admin');
        } else if (user.emailAddresses.some(email => email.emailAddress.endsWith('@manager.aria.com'))) {
          roles.push('manager');
        } else if (user.emailAddresses.some(email => email.emailAddress.endsWith('@analyst.aria.com'))) {
          roles.push('analyst');
        }
        
        // Remove duplicates
        setUserRoles([...new Set(roles)]);
        
      } catch (error) {
        console.error("Error loading user roles:", error);
        setUserRoles(['user']); // Fallback to basic role
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRoles();
  }, [user, isUserLoaded]);
  
  // Helper to check if a string is a valid role
  const isValidRole = (role: string): role is UserRole => {
    return ['user', 'analyst', 'manager', 'admin'].includes(role);
  };
  
  // Check if user has a specific role
  const hasRole = (role: UserRole): boolean => {
    return userRoles.includes(role);
  };
  
  // Check if user has any of the specified roles
  const hasAnyRole = (roles: UserRole[]): boolean => {
    return roles.some(role => userRoles.includes(role));
  };
  
  // Check if user has all of the specified roles
  const hasAllRoles = (roles: UserRole[]): boolean => {
    return roles.every(role => userRoles.includes(role));
  };
  
  const contextValue: RbacContextType = {
    userRoles,
    isLoading,
    hasRole,
    hasAnyRole,
    hasAllRoles
  };
  
  return (
    <RbacContext.Provider value={contextValue}>
      {children}
    </RbacContext.Provider>
  );
};

// Custom hook to use the RBAC context
export const useRbac = (): RbacContextType => {
  const context = useContext(RbacContext);
  if (!context) {
    throw new Error('useRbac must be used within an RbacProvider');
  }
  return context;
};

// Create a protected component wrapper
interface RoleProtectedProps {
  children: ReactNode;
  requiredRoles: UserRole | UserRole[];
  requireAll?: boolean;
  fallback?: ReactNode;
}

export const RoleProtected = ({
  children,
  requiredRoles,
  requireAll = false,
  fallback = null
}: RoleProtectedProps) => {
  const { hasRole, hasAnyRole, hasAllRoles, isLoading } = useRbac();
  
  // While roles are loading, show nothing
  if (isLoading) {
    return null;
  }
  
  // Check for multiple roles
  if (Array.isArray(requiredRoles)) {
    const hasAccess = requireAll ? hasAllRoles(requiredRoles) : hasAnyRole(requiredRoles);
    return hasAccess ? <>{children}</> : <>{fallback}</>;
  }
  
  // Check for a single role
  return hasRole(requiredRoles) ? <>{children}</> : <>{fallback}</>;
};
