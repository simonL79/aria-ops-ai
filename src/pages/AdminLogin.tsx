
import { useState, useEffect } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import PublicLayout from '@/components/layout/PublicLayout';
import { useAuth } from '@/hooks/useAuth';

export default function AdminLogin() {
  const [email, setEmail] = useState('simonlindsay7988@gmail.com');
  const [isSending, setIsSending] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  
  // Show error message from URL parameters if present
  useEffect(() => {
    if (error && errorDescription) {
      toast.error(error, {
        description: decodeURIComponent(errorDescription)
      });
    }
  }, [error, errorDescription]);
  
  // If already authenticated and is the admin, redirect to blog admin page
  if (isAuthenticated && user?.email === 'simonlindsay7988@gmail.com') {
    return <Navigate to="/blog/admin" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    
    try {
      console.log("Sending magic link to:", email);
      console.log("Redirect URL:", `${window.location.origin}/blog/admin`);
      
      // For magic link login, use signInWithOtp instead of password-based auth
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/blog/admin`,
        },
      });

      console.log("Magic link response:", { data, error });

      if (error) {
        toast.error(`Login error: ${error.message}`);
      } else {
        toast.success('Magic link sent! Check your inbox (and spam folder) to continue.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <PublicLayout>
      <div className="container mx-auto py-16 px-4">
        <Card className="max-w-md mx-auto">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              A.R.I.A. Admin Access
            </CardTitle>
            <CardDescription className="text-center">
              Secure login via email magic link
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-md">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-800">Magic Link Authentication</h3>
                  <p className="text-sm text-blue-600">
                    A secure login link will be sent to your email. Check your inbox and spam folder after requesting.
                  </p>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Admin email address"
                  disabled={true}
                  className="bg-gray-100"
                />
                <p className="text-xs text-muted-foreground">
                  Only authorized admin emails can access this area.
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSending}
              >
                {isSending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Magic Link...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Magic Link
                  </>
                )}
              </Button>
              
              <div className="text-center mt-4">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/')}
                  className="text-sm"
                  type="button"
                >
                  Return to Home
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
}
