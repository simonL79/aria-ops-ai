
import React from 'react';
import { Navigate } from 'react-router-dom';
import PublicLayout from '@/components/layout/PublicLayout';
import BlogAdminPanel from '@/components/blog/BlogAdminPanel';
import MediumImportButton from '@/components/blog/MediumImportButton';
import { Button } from '@/components/ui/button';
import { Mail, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const BlogAdminPage = () => {
  const [isSending, setIsSending] = React.useState(false);
  const { user, isAuthenticated, isLoading } = useAuth();
  
  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Verifying admin access...</span>
      </div>
    );
  }
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  // Check if user is admin (based on email)
  if (user?.email !== 'simonlindsay7988@gmail.com') {
    return <Navigate to="/dashboard" replace />;
  }
  
  const handleSendMagicLink = async () => {
    if (!user || !user.email) {
      toast.error("User information not available");
      return;
    }
    
    setIsSending(true);
    
    try {
      toast.info("Sending magic link...");
      
      const { error } = await supabase.auth.signInWithOtp({
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/blog/admin`,
        },
      });
      
      if (error) throw error;
      
      toast.success("Magic link sent! Check your email.");
    } catch (error) {
      console.error("Error sending magic link:", error);
      toast.error("Failed to send magic link. Please try again.");
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold">Blog Administration</h1>
          
          <div className="flex gap-3 mt-4 md:mt-0">
            <MediumImportButton />
            <Button 
              variant="outline" 
              onClick={handleSendMagicLink} 
              disabled={isSending}
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send New Magic Link
                </>
              )}
            </Button>
          </div>
        </div>
        
        <BlogAdminPanel />
      </div>
    </PublicLayout>
  );
};

export default BlogAdminPage;
