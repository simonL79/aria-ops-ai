
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
      
      // First try: Check with count
      const { count, error } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('role', 'admin');
      
      if (error) {
        console.error('Error checking admin status:', error);
        
        // Fallback: Try direct select if count fails
        console.log('Count query failed, trying direct select...');
        const { data: directData, error: directError } = await supabase
          .from('user_roles')
          .select('id, role')
          .eq('user_id', userId)
          .eq('role', 'admin')
          .limit(1);
        
        if (directError) {
          console.error('Direct select also failed:', directError);
          setIsAdmin(false);
          return;
        }
        
        const hasAdminRole = directData && directData.length > 0;
        console.log('Direct select result:', directData, 'hasAdminRole:', hasAdminRole);
        setIsAdmin(hasAdminRole);
        return;
      }

      const hasAdminRole = count !== null && count > 0;
      console.log('Admin status check - count:', count, 'hasAdminRole:', hasAdminRole);
      setIsAdmin(hasAdminRole);
      
      // If count is 0, double-check with direct select
      if (!hasAdminRole) {
        console.log('Count returned 0, double-checking with direct select...');
        const { data: directData, error: directError } = await supabase
          .from('user_roles')
          .select('id, role')
          .eq('user_id', userId)
          .eq('role', 'admin')
          .limit(1);
        
        if (!directError && directData && directData.length > 0) {
          console.log('Direct select found admin role (count was wrong):', directData);
          setIsAdmin(true);
        } else {
          console.log('Confirmed: No admin role found for user');
          setIsAdmin(false);
        }
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
          // Check admin status immediately
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
      console.log('Signing out user...');
      // Clear local state immediately
      setIsAdmin(false);
      setUser(null);
      setSession(null);
      
      // Then sign out from Supabase
      await supabase.auth.signOut();
      console.log('Sign out successful');
    } catch (error) {
      console.error('Error signing out:', error);
      // Even if signOut fails, clear local state
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
