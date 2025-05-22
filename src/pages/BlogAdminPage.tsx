import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PublicLayout from '@/components/layout/PublicLayout';
import BlogAdminPanel from '@/components/blog/BlogAdminPanel';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogIn, Key } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const BlogAdminPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading, user } = useAuth();
  
  useEffect(() => {
    // If not authenticated and not loading, redirect to login
    if (!isAuthenticated && !isLoading) {
      console.info('Not authenticated, redirecting to auth page');
      // Pass current path to return after login
      navigate('/auth', { 
        state: { from: location.pathname + location.search } 
      });
    } else if (isAuthenticated && user) {
      // User is authenticated, show welcome toast
      toast.success(`Welcome to Blog Admin, ${user.email}`);
    }
  }, [isAuthenticated, isLoading, navigate, location, user]);
  
  const handleResetPassword = async () => {
    if (!user || !user.email) {
      toast.error("User information not available");
      return;
    }
    
    try {
      toast.info("Sending password reset link...");
      
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/admin-reset`
      });
      
      if (error) throw error;
      
      toast.success("Password reset link sent! Check your email.");
    } catch (error) {
      console.error("Error sending reset link:", error);
      toast.error("Failed to send reset link. Please try again.");
    }
  };
  
  if (isLoading) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </PublicLayout>
    );
  }
  
  if (!isAuthenticated) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Authentication Required</CardTitle>
              <CardDescription>
                You need to be logged in to access the blog admin area.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/auth', { 
                  state: { from: location.pathname + location.search }
                })}
                className="w-full"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign In to Continue
              </Button>
            </CardContent>
          </Card>
        </div>
      </PublicLayout>
    );
  }
  
  // Check if the current user is an admin
  const isAdmin = user?.email === "simonlindsay7988@gmail.com";
  
  return (
    <PublicLayout>
      <Helmet>
        <title>Blog Administration - A.R.I.A™</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold">Blog Administration</h1>
          
          {isAdmin && (
            <Button 
              variant="outline" 
              onClick={handleResetPassword} 
              className="mt-4 md:mt-0"
            >
              <Key className="mr-2 h-4 w-4" />
              Reset Admin Password
            </Button>
          )}
        </div>
        
        <BlogAdminPanel />
      </div>
    </PublicLayout>
  );
};

export default BlogAdminPage;
