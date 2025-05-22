
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PublicLayout from '@/components/layout/PublicLayout';
import BlogAdminPanel from '@/components/blog/BlogAdminPanel';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogIn, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import AuthGuard from '@/components/auth/AuthGuard';

const BlogAdminPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  
  useEffect(() => {
    // If authenticated and is admin, show welcome toast
    if (isAuthenticated && user?.email === 'simonlindsay7988@gmail.com') {
      toast.success(`Welcome to Blog Admin, ${user.email}`);
    }
  }, [isAuthenticated, user]);
  
  const handleSendMagicLink = async () => {
    if (!user || !user.email) {
      toast.error("User information not available");
      return;
    }
    
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
    }
  };
  
  // Use AuthGuard to protect this page with admin-only access
  return (
    <AuthGuard adminOnly={true} redirectTo="/admin-login">
      <PublicLayout>
        <Helmet>
          <title>Blog Administration - A.R.I.A™</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h1 className="text-3xl font-bold">Blog Administration</h1>
            
            <Button 
              variant="outline" 
              onClick={handleSendMagicLink} 
              className="mt-4 md:mt-0"
            >
              <Mail className="mr-2 h-4 w-4" />
              Send New Magic Link
            </Button>
          </div>
          
          <BlogAdminPanel />
        </div>
      </PublicLayout>
    </AuthGuard>
  );
};

export default BlogAdminPage;
