
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: string | null;
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  userId: null,
  user: null,
  session: null,
  isAdmin: false,
  signOut: async () => {},
  signIn: async () => false,
  signUp: async () => false
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
      (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setIsAuthenticated(!!newSession);
        
        // Check if user is admin based on email
        if (newSession?.user) {
          const userEmail = newSession.user.email;
          setIsAdmin(userEmail === ADMIN_EMAIL);
          
          // In a production app, you would check user roles in a database
          // This is just a simplification for the demo
          if (event === 'SIGNED_IN') {
            console.log("User signed in:", userEmail);
          }
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
        const userEmail = currentSession.user.email;
        setIsAdmin(userEmail === ADMIN_EMAIL);
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
      
      if (data.user) {
        toast.success("Signed in successfully!");
        return true;
      } else {
        toast.error("Login failed", {
          description: "Invalid email or password"
        });
        return false;
      }
    } catch (error) {
      console.error("Error signing in:", error);
      toast.error("Error signing in", {
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
      return false;
    }
  };
  
  const signUp = async (
    email: string, 
    password: string, 
    firstName?: string, 
    lastName?: string
  ): Promise<boolean> => {
    try {
      // Create user with metadata
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            firstName,
            lastName,
          }
        }
      });
      
      if (error) {
        toast.error("Sign up failed", {
          description: error.message
        });
        return false;
      }
      
      if (data.user) {
        toast.success("Signed up successfully!");
        
        // Check if email confirmation is required
        if (data.session === null) {
          toast.info("Please check your email to confirm your account");
        }
        
        return true;
      } else {
        toast.error("Sign up failed");
        return false;
      }
    } catch (error) {
      console.error("Error signing up:", error);
      toast.error("Error signing up", {
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
    userId: user?.id || null,
    user,
    session,
    isAdmin,
    signOut: handleSignOut,
    signIn,
    signUp
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default useAuth;
