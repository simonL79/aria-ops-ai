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
  isAdminLoading: boolean;
  clientIds: string[];
  isPortalUser: boolean;
  isPortalLoading: boolean;
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
  // Start true so route guards wait for the first admin check before redirecting
  const [isAdminLoading, setIsAdminLoading] = useState(true);
  const [clientIds, setClientIds] = useState<string[]>([]);
  const [isPortalLoading, setIsPortalLoading] = useState(true);

  const checkPortalAccess = async (userId: string) => {
    setIsPortalLoading(true);
    try {
      const { data, error } = await (supabase.rpc as any)('get_user_client_ids', { _user_id: userId });
      if (error) {
        console.warn('Portal access check failed:', error.message);
        setClientIds([]);
        return;
      }
      const ids = Array.isArray(data) ? data.map((r: any) => (typeof r === 'string' ? r : r.get_user_client_ids ?? r)) : [];
      setClientIds(ids.filter(Boolean));
    } catch (e) {
      console.error('Portal access exception:', e);
      setClientIds([]);
    } finally {
      setIsPortalLoading(false);
    }
  };

  // Removed: forceAdminAccess was a security vulnerability (CLIENT_SIDE_AUTH)
  const forceAdminAccess = () => {
    console.warn('⚠️ forceAdminAccess is disabled. Use server-side role assignment instead.');
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

  // Enhanced admin check - tries RPC first, falls back to direct user_roles query
  const checkAdminStatus = async (userId: string, _userEmail: string) => {
    setIsAdminLoading(true);
    try {
      console.log('🔍 Checking admin status for:', userId);

      const { data, error } = await (supabase.rpc as any)('is_current_user_admin');

      if (!error && data === true) {
        console.log('✅ Admin confirmed via RPC');
        setIsAdmin(true);
        return true;
      }

      if (error) {
        console.warn('RPC is_current_user_admin failed, falling back to direct query:', error.message);
      }

      // Fallback: direct query (RLS allows users to read their own role)
      const { data: roleRow, error: roleErr } = await (supabase
        .from('user_roles') as any)
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();

      if (roleErr) {
        console.error('❌ Fallback admin query failed:', roleErr);
        setIsAdmin(false);
        return false;
      }

      const isAdminUser = !!roleRow;
      console.log(isAdminUser ? '✅ Admin confirmed via fallback' : 'ℹ️ User is not admin');
      setIsAdmin(isAdminUser);
      return isAdminUser;
    } catch (error) {
      console.error('❌ Error checking admin status:', error);
      setIsAdmin(false);
      return false;
    } finally {
      setIsAdminLoading(false);
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
        
        // Check admin if user exists; otherwise mark admin check complete
        if (currentSession?.user) {
          await checkAdminStatus(currentSession.user.id, currentSession.user.email || '');
          await checkPortalAccess(currentSession.user.id);

          // Initialize database
          try {
            await initializeDatabase();
          } catch (dbError) {
            console.error('Database init error:', dbError);
          }
        } else {
          setIsAdmin(false);
          setIsAdminLoading(false);
          setClientIds([]);
          setIsPortalLoading(false);
        }

        setIsLoading(false);
        console.log('✅ Auth initialization complete');

      } catch (error) {
        console.error('❌ Auth initialization error:', error);
        if (mounted) {
          setIsLoading(false);
          setIsAdminLoading(false);
        }
      }
    };

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        if (!mounted) return;

        console.log('🔄 Auth state change:', event);

        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (event === 'SIGNED_IN' && newSession?.user) {
          // Defer Supabase calls out of the listener callback to avoid deadlocks
          setIsAdminLoading(true);
          setTimeout(() => {
            if (!mounted) return;
            checkAdminStatus(newSession.user.id, newSession.user.email || '');
          }, 0);
        }

        if (event === 'SIGNED_OUT') {
          setIsAdmin(false);
          setIsAdminLoading(false);
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
    isAdminLoading,
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
