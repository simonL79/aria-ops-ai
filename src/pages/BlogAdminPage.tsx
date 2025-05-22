
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PublicLayout from '@/components/layout/PublicLayout';
import BlogAdminPanel from '@/components/blog/BlogAdminPanel';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

const BlogAdminPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  
  useEffect(() => {
    // If not authenticated and not loading, redirect to login
    if (!isAuthenticated && !isLoading) {
      // Pass current path to return after login
      navigate('/auth', { 
        state: { from: location.pathname + location.search } 
      });
    }
  }, [isAuthenticated, isLoading, navigate, location]);
  
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
  
  return (
    <PublicLayout>
      <Helmet>
        <title>Blog Administration - A.R.I.A™</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Blog Administration</h1>
        <BlogAdminPanel />
      </div>
    </PublicLayout>
  );
};

export default BlogAdminPage;
