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
  forceReset: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Simple force reset - clears everything immediately
  const forceReset = async () => {
    console.log('🔄 FORCE RESET: Clearing all auth state');
    
    // Clear state immediately
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    setIsLoading(false);
    
    // Clear storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Sign out from Supabase
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (error) {
      console.error('Error during signout:', error);
    }
    
    console.log('✅ FORCE RESET: Complete');
  };

  // Simple admin check
  const checkAdminStatus = async (userId: string) => {
    try {
      console.log('🔍 Checking admin status for:', userId);
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .limit(1);
      
      const hasAdminRole = !error && data && data.length > 0;
      console.log('✅ Admin status:', hasAdminRole);
      setIsAdmin(hasAdminRole);
      return hasAdminRole;
    } catch (error) {
      console.error('❌ Error checking admin status:', error);
      setIsAdmin(false);
      return false;
    }
  };

  // Initialize auth - keep it simple
  useEffect(() => {
    console.log('🚀 AuthProvider: Starting initialization');
    let mounted = true;

    const initialize = async () => {
      try {
        // Get current session
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.error('❌ Session error:', error);
          setIsLoading(false);
          return;
        }

        console.log('📋 Current session:', currentSession ? 'Found' : 'None');
        
        // Update state
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Check admin if user exists
        if (currentSession?.user) {
          await checkAdminStatus(currentSession.user.id);
          
          // Initialize database
          try {
            await initializeDatabase();
          } catch (dbError) {
            console.error('Database init error:', dbError);
          }
        }
        
        setIsLoading(false);
        console.log('✅ Auth initialization complete');
        
      } catch (error) {
        console.error('❌ Auth initialization error:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!mounted) return;
        
        console.log('🔄 Auth state change:', event);
        
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (event === 'SIGNED_IN' && newSession?.user) {
          await checkAdminStatus(newSession.user.id);
        }
        
        if (event === 'SIGNED_OUT') {
          setIsAdmin(false);
        }
      }
    );

    // Start initialization
    initialize();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Attempting sign in for:', email);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('❌ Sign in error:', error.message);
      } else {
        console.log('✅ Sign in successful');
      }
      
      return { error };
    } catch (error) {
      console.error('❌ Sign in exception:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('🚪 Signing out...');
      setIsAdmin(false);
      await supabase.auth.signOut();
      console.log('✅ Sign out complete');
    } catch (error) {
      console.error('❌ Sign out error:', error);
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
    forceReset,
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
