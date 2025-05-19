
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useClerk, useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: string | null;
  user: any;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  userId: null,
  user: null,
  isAdmin: false,
  signOut: async () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authError, setAuthError] = useState<Error | null>(null);
  
  useEffect(() => {
    // Set a maximum timeout for loading state
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        console.warn("Auth loading timed out - forcing completion");
        
        // If clerk hasn't loaded by now, we might have an issue with the key or network
        if (!isLoaded) {
          const error = new Error("Authentication service failed to load");
          console.error(error);
          setAuthError(error);
          toast.error("Authentication service is not responding. Please refresh the page.");
        }
      }
    }, 5000); // 5 second maximum loading time
    
    return () => clearTimeout(timeoutId);
  }, [isLoading, isLoaded]);
  
  useEffect(() => {
    if (isLoaded) {
      setIsLoading(false);
      console.log("Auth loaded, user:", user?.id || "not signed in");
      
      // Check if user is admin when signed in
      if (isSignedIn && user?.id) {
        checkAdminRole(user.id).catch(err => {
          console.error("Error checking admin role:", err);
          setIsAdmin(false);
        });
      } else {
        setIsAdmin(false);
      }
    }
  }, [isLoaded, user, isSignedIn]);
  
  const checkAdminRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .rpc('has_role', { _user_id: userId, _role: 'admin' });
      
      if (error) {
        console.error("Error checking admin role:", error);
        setIsAdmin(false);
      } else {
        setIsAdmin(data || false);
        console.log("User admin status:", data);
      }
    } catch (error) {
      console.error("Error checking admin role:", error);
      setIsAdmin(false);
    }
  };
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out");
    }
  };
  
  const value = {
    isAuthenticated: isSignedIn || false,
    isLoading,
    userId: user?.id || null,
    user,
    isAdmin,
    signOut: handleSignOut
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default useAuth;
