
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
      
      // Simple query to check if user has admin role
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();
      
      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        return;
      }

      const hasAdminRole = !!data;
      console.log('Admin status result:', hasAdminRole);
      setIsAdmin(hasAdminRole);
      
      // If this is immediately after login and user should be admin, force refresh
      if (!hasAdminRole && userId) {
        console.log('Admin role not found, checking again in 1 second...');
        setTimeout(async () => {
          const { data: retryData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', userId)
            .eq('role', 'admin')
            .maybeSingle();
          
          const retryHasAdmin = !!retryData;
          console.log('Retry admin status result:', retryHasAdmin);
          setIsAdmin(retryHasAdmin);
        }, 1000);
      }
    } catch (error) {
      console.error('Error in checkAdminStatus:', error);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    console.log('AuthProvider initializing...');
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state change:', event, { 
          hasSession: !!currentSession,
          userId: currentSession?.user?.id 
        });
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        // Handle admin status checking
        if (event === 'SIGNED_IN' && currentSession?.user) {
          // Use setTimeout to avoid potential recursion
          setTimeout(() => {
            checkAdminStatus(currentSession.user.id);
          }, 100);
          
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

        if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed successfully');
          if (currentSession?.user) {
            setTimeout(() => {
              checkAdminStatus(currentSession.user.id);
            }, 100);
          }
        }

        setIsLoading(false);
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
        } else {
          console.log('Initial session check:', { 
            hasSession: !!initialSession,
            userId: initialSession?.user?.id 
          });
          
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          
          if (initialSession?.user) {
            await checkAdminStatus(initialSession.user.id);
            await initializeDatabase().catch(error => {
              console.error('Error initializing database:', error);
            });
          }
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        setIsLoading(false);
      }
    };

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
      await supabase.auth.signOut();
      setIsAdmin(false);
    } catch (error) {
      console.error('Error signing out:', error);
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
