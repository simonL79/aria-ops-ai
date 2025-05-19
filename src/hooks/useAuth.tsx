
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useClerk, useUser } from '@clerk/clerk-react';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: string | null;
  user: any;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  userId: null,
  user: null,
  signOut: async () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (isLoaded) {
      setIsLoading(false);
      console.log("Auth loaded, user:", user?.id || "not signed in");
    }
  }, [isLoaded, user]);
  
  const value = {
    isAuthenticated: isSignedIn || false,
    isLoading,
    userId: user?.id || null,
    user,
    signOut
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default useAuth;
