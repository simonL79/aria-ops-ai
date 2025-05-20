
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: string | null;
  user: any;
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
  isAdmin: false,
  signOut: async () => {},
  signIn: async () => false,
  signUp: async () => false
});

// Mock user database - in a real app this would come from a database
const mockUsers = [
  {
    id: 'simon-admin-user',
    email: 'simonlindsay7988@gmail.com',
    password: 'Kaypetdel123',
    firstName: 'Simon',
    lastName: 'Lindsay',
    isAdmin: true
  },
  {
    id: 'admin-user-1',
    email: 'admin@example.com',
    password: 'password123', // In a real app, never store plain text passwords
    firstName: 'Admin',
    lastName: 'User',
    isAdmin: true
  },
  {
    id: 'test-user-1',
    email: 'user@example.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User',
    isAdmin: false
  }
];

// The email address you want to grant admin access to
const ADMIN_EMAIL = 'simonlindsay7988@gmail.com';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if user is already logged in via localStorage
    const checkAuth = () => {
      const storedUser = localStorage.getItem('mock_auth_user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        setIsAdmin(parsedUser.isAdmin || parsedUser.email === ADMIN_EMAIL);
        console.log("User restored from storage:", parsedUser.email);
      }
      setIsLoading(false);
    };
    
    // Set a maximum timeout for loading state
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        console.warn("Auth loading timed out - forcing completion");
      }
    }, 2000); // 2 second maximum loading time
    
    checkAuth();
    return () => clearTimeout(timeoutId);
  }, []);
  
  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      // In a real app, this would validate against a secure backend
      const foundUser = mockUsers.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      
      if (foundUser) {
        // Create a safe user object (without password)
        const safeUser = { ...foundUser };
        delete safeUser.password;
        
        // Store in state and localStorage
        setUser(safeUser);
        setIsAuthenticated(true);
        setIsAdmin(safeUser.isAdmin || email === ADMIN_EMAIL);
        localStorage.setItem('mock_auth_user', JSON.stringify(safeUser));
        
        toast.success("Signed in successfully!");
        return true;
      } else {
        toast.error("Invalid email or password");
        return false;
      }
    } catch (error) {
      console.error("Error signing in:", error);
      toast.error("Error signing in");
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
      // Check if user already exists
      if (mockUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        toast.error("User with this email already exists");
        return false;
      }
      
      // Create new user
      const newUser = {
        id: `user-${Date.now()}`,
        email,
        password,
        firstName: firstName || '',
        lastName: lastName || '',
        isAdmin: email === ADMIN_EMAIL
      };
      
      // Add to mock database
      mockUsers.push(newUser);
      
      // Create a safe user object (without password)
      const safeUser = { ...newUser };
      delete safeUser.password;
      
      // Login the user after signup
      setUser(safeUser);
      setIsAuthenticated(true);
      setIsAdmin(safeUser.isAdmin || email === ADMIN_EMAIL);
      localStorage.setItem('mock_auth_user', JSON.stringify(safeUser));
      
      toast.success("Signed up successfully!");
      return true;
    } catch (error) {
      console.error("Error signing up:", error);
      toast.error("Error signing up");
      return false;
    }
  };
  
  const handleSignOut = async () => {
    try {
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      localStorage.removeItem('mock_auth_user');
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out");
    }
  };
  
  const value = {
    isAuthenticated,
    isLoading,
    userId: user?.id || null,
    user,
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
