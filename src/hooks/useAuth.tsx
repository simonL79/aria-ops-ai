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
  forceAdminAccess: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Emergency admin access for business owner
  const forceAdminAccess = () => {
    console.log('🚨 FORCE ADMIN ACCESS: Business owner override');
    setIsAdmin(true);
    localStorage.setItem('force_admin_access', 'true');
  };

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

  // Enhanced admin check with business owner email override
  const checkAdminStatus = async (userId: string, userEmail: string) => {
    try {
      console.log('🔍 Checking admin status for:', userId, userEmail);
      
      // Business owner email override
      if (userEmail === 'simonlindsay7988@gmail.com') {
        console.log('✅ Business owner detected - granting admin access');
        setIsAdmin(true);
        return true;
      }

      // Check for forced admin access
      if (localStorage.getItem('force_admin_access') === 'true') {
        console.log('✅ Force admin access detected');
        setIsAdmin(true);
        return true;
      }
      
      // Use the new is_current_user_admin function
      const { data, error } = await supabase.rpc('is_current_user_admin');
      
      if (error) {
        console.error('Error checking admin status:', error);
        // Fallback: if this is the business owner email, grant access anyway
        if (userEmail === 'simonlindsay7988@gmail.com') {
          console.log('🚨 Fallback: Granting admin access to business owner');
          setIsAdmin(true);
          return true;
        }
        setIsAdmin(false);
        return false;
      }

      console.log('✅ Admin status from function:', data);
      const isAdminUser = data === true;
      setIsAdmin(isAdminUser);
      return isAdminUser;
      
    } catch (error) {
      console.error('❌ Error checking admin status:', error);
      
      // Fallback: if this is the business owner email, grant access anyway
      if (userEmail === 'simonlindsay7988@gmail.com') {
        console.log('🚨 Fallback: Granting admin access to business owner');
        setIsAdmin(true);
        return true;
      }
      
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
          await checkAdminStatus(currentSession.user.id, currentSession.user.email || '');
          
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
          await checkAdminStatus(newSession.user.id, newSession.user.email || '');
        }
        
        if (event === 'SIGNED_OUT') {
          setIsAdmin(false);
          localStorage.removeItem('force_admin_access');
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
      localStorage.removeItem('force_admin_access');
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
    forceAdminAccess,
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
