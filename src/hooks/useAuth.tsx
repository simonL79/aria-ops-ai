
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import { initializeDatabase } from '@/utils/initializeMonitoring';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminStatus = async (userId: string) => {
    try {
      console.log('Checking admin status for user:', userId);
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .limit(1);
      
      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        return false;
      }

      const hasAdminRole = data && data.length > 0;
      console.log('Admin status check result:', { hasAdminRole, data });
      setIsAdmin(hasAdminRole);
      return hasAdminRole;
      
    } catch (error) {
      console.error('Error in checkAdminStatus:', error);
      setIsAdmin(false);
      return false;
    }
  };

  useEffect(() => {
    console.log('AuthProvider initializing...');
    
    // Get initial session first
    const getInitialSession = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
          setIsLoading(false);
          return;
        }
        
        console.log('Initial session check:', { 
          hasSession: !!initialSession,
          userId: initialSession?.user?.id 
        });
        
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        
        if (initialSession?.user) {
          await checkAdminStatus(initialSession.user.id);
          try {
            await initializeDatabase();
          } catch (dbError) {
            console.error('Error initializing database:', dbError);
          }
        }
        
        // Always set loading to false after processing
        setIsLoading(false);
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        setIsLoading(false);
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state change:', event, { 
          hasSession: !!currentSession,
          userId: currentSession?.user?.id 
        });
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (event === 'SIGNED_IN' && currentSession?.user) {
          await checkAdminStatus(currentSession.user.id);
          try {
            await initializeDatabase();
            console.log('User signed in successfully:', currentSession.user.email);
          } catch (error) {
            console.error('Error during sign in initialization:', error);
          }
        }

        if (event === 'SIGNED_OUT') {
          setIsAdmin(false);
          console.log('User signed out');
        }

        if (event === 'TOKEN_REFRESHED' && currentSession?.user) {
          console.log('Token refreshed successfully');
          await checkAdminStatus(currentSession.user.id);
        }

        // Always set loading to false after handling auth state changes
        setIsLoading(false);
      }
    );

    // Initialize session
    getInitialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      console.error('Error signing in:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out user...');
      setIsAdmin(false);
      setUser(null);
      setSession(null);
      
      await supabase.auth.signOut();
      console.log('Sign out successful');
    } catch (error) {
      console.error('Error signing out:', error);
      setIsAdmin(false);
      setUser(null);
      setSession(null);
    }
  };

  const value = {
    user,
    session,
    isAuthenticated: !!user,
    isLoading,
    isAdmin,
    signOut,
    signIn,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
