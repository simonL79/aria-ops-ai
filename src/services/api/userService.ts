
import { supabase } from '@/integrations/supabase/client';

// Define the type for the user roles available in the application
export type AppRole = 'admin' | 'user' | 'staff' | 'analyst' | 'security';

// Get current user profile information
export const getCurrentUserProfile = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;
    
    return {
      id: user.id,
      email: user.email,
      firstName: user.user_metadata?.firstName || '',
      lastName: user.user_metadata?.lastName || '',
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};
