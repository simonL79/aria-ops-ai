
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import { initializeDatabase } from '@/utils/initializeMonitoring';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider initializing...');
    
    // Set a reasonable timeout for auth loading
    const authTimeout = setTimeout(() => {
      if (isLoading) {
        console.warn('Auth loading timed out - forcing completion');
        setIsLoading(false);
      }
    }, 5000);

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
        } else {
          console.log('Get session result:', { 
            _type: typeof initialSession, 
            value: initialSession ? 'session_exists' : 'undefined'
          });
          
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          
          // Initialize database if we have a session
          if (initialSession?.user) {
            initializeDatabase().catch(error => {
              console.error('Error initializing database:', error);
            });
          }
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        setIsLoading(false);
        clearTimeout(authTimeout);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state change:', event, { 
          _type: typeof currentSession, 
          value: currentSession ? 'session_exists' : 'undefined'
        });
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoading(false);
        clearTimeout(authTimeout);

        // Initialize database when user signs in
        if (event === 'SIGNED_IN' && currentSession?.user) {
          try {
            await initializeDatabase();
          } catch (error) {
            console.error('Error initializing database after sign in:', error);
          }
        }
      }
    );

    return () => {
      clearTimeout(authTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    session,
    isAuthenticated: !!user,
    isLoading,
    signOut,
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
