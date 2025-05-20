
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";
import { logActivity, LogAction } from "@/services/activityLogService";

export type AppRole = "admin" | "user" | "staff" | "security";

export interface UserProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role?: AppRole;
  createdAt?: string;
}

/**
 * Get the current user's profile
 */
export const getCurrentUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return null;
    }
    
    // Get user profile from profiles table if it exists
    // Note: We check if the table exists in the database before querying
    let profileData = null;
    
    // Get user roles from user_roles table
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id);
    
    if (roleError) {
      console.error("Error fetching user roles:", roleError);
    }
    
    // Return profile data
    return {
      id: session.user.id,
      firstName: session.user.user_metadata?.firstName,
      lastName: session.user.user_metadata?.lastName,
      email: session.user.email || '',
      role: roleData && roleData[0]?.role || 'user',
      createdAt: session.user.created_at
    };
    
  } catch (error) {
    console.error("Error in getCurrentUserProfile:", error);
    return null;
  }
};

/**
 * Update the current user's profile
 */
export const updateUserProfile = async (profile: Partial<UserProfile>): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      toast.error("You must be logged in to update your profile");
      return false;
    }
    
    // Update user metadata
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        firstName: profile.firstName,
        lastName: profile.lastName,
      }
    });
    
    if (authError) {
      console.error("Error updating auth metadata:", authError);
      toast.error("Failed to update profile");
      return false;
    }
    
    toast.success("Profile updated successfully");
    return true;
    
  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    toast.error("An error occurred while updating your profile");
    return false;
  }
};

/**
 * Check if the current user has a specific role
 */
export const userHasRole = async (role: AppRole): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return false;
    }
    
    // Check if user is admin by email (fallback)
    if (role === 'admin' && session.user.email === 'simonlindsay7988@gmail.com') {
      return true;
    }
    
    // Check user roles from database
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .eq('role', role);
    
    if (error) {
      console.error("Error fetching user roles:", error);
      return false;
    }
    
    return data && data.length > 0;
    
  } catch (error) {
    console.error("Error in userHasRole:", error);
    return false;
  }
};

/**
 * Create a new user in the system (for admins)
 */
export const createUser = async (email: string, password: string, role?: AppRole): Promise<boolean> => {
  try {
    // Check if current user is admin
    const isAdmin = await userHasRole('admin');
    
    if (!isAdmin) {
      toast.error("You don't have permission to create users");
      return false;
    }
    
    // Create new user
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });
    
    if (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to create user", {
        description: error.message
      });
      return false;
    }
    
    if (data.user && role) {
      // Assign role to new user
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: data.user.id,
          role
        });
      
      if (roleError) {
        console.error("Error assigning role:", roleError);
        toast.warning("User created but role assignment failed");
      }
    }
    
    // Log the activity
    await logActivity(
      LogAction.CREATE,
      `Created new user: ${email} with role: ${role || 'user'}`,
      'user',
      email
    );
    
    toast.success("User created successfully");
    return true;
    
  } catch (error) {
    console.error("Error in createUser:", error);
    toast.error("An error occurred while creating the user");
    return false;
  }
};

/**
 * Assign the staff role to a user (admin only)
 */
export const assignStaffRole = async (email: string): Promise<boolean> => {
  try {
    // Check if current user is admin
    const isAdmin = await userHasRole('admin');
    
    if (!isAdmin) {
      toast.error("Only admins can assign staff roles");
      return false;
    }
    
    const { data, error } = await supabase.rpc('assign_staff_role', { user_email: email });
    
    if (error) {
      console.error("Error assigning staff role:", error);
      toast.error("Failed to assign staff role", {
        description: error.message
      });
      return false;
    }
    
    await logActivity(
      LogAction.UPDATE,
      `Assigned staff role to user: ${email}`,
      'user',
      email
    );
    
    toast.success(`Staff role assigned to ${email}`);
    return true;
  } catch (error) {
    console.error("Error in assignStaffRole:", error);
    toast.error("An error occurred while assigning the role");
    return false;
  }
};
