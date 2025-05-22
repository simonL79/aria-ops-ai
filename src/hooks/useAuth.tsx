
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  session: null,
  isAdmin: false,
  signIn: async () => false,
  signOut: async () => {},
});

// Define admin email for special treatment
const ADMIN_EMAIL = 'simonlindsay7988@gmail.com';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setIsAuthenticated(!!newSession);
        
        // Check if user is admin based on email
        if (newSession?.user) {
          setIsAdmin(newSession.user.email === ADMIN_EMAIL);
        } else {
          setIsAdmin(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsAuthenticated(!!currentSession);
      
      if (currentSession?.user) {
        setIsAdmin(currentSession.user.email === ADMIN_EMAIL);
      }
      
      setIsLoading(false);
    });
    
    // Set a maximum timeout for loading state
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        console.warn("Auth loading timed out - forcing completion");
      }
    }, 2000);
    
    return () => {
      subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, []);
  
  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast.error("Login failed", {
          description: error.message
        });
        return false;
      }
      
      return !!data.user;
    } catch (error) {
      console.error("Error signing in:", error);
      toast.error("Error signing in", {
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
      return false;
    }
  };
  
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error("Error signing out", {
          description: error.message
        });
        return;
      }
      
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out", {
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
    }
  };
  
  const value = {
    isAuthenticated,
    isLoading,
    user,
    session,
    isAdmin,
    signIn,
    signOut: handleSignOut,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default useAuth;
