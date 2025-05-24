
import { useState, useEffect } from "react";
import { Navigate, useLocation, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import LoginForm from "@/components/auth/LoginForm";

const Authentication = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const from = location.state?.from?.pathname || "/dashboard";
  const authType = searchParams.get('type');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  
  useEffect(() => {
    // Handle auth errors from URL params
    if (error) {
      console.error('Auth error from URL:', error, errorDescription);
    }
    
    // Small timeout to prevent flash
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [error, errorDescription]);
  
  // If still loading, show a simple loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  // If already authenticated, redirect to the dashboard or previous page
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  // Message for different auth types
  const getAuthTypeMessage = () => {
    if (authType === 'recovery') {
      return (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-md">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-800">Password Reset</h3>
              <p className="text-sm text-blue-600">
                If you clicked a password reset link in your email, please enter your new password.
                If no password form appears, the link may have expired. Try requesting a new reset link.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (authType === 'magiclink') {
      return (
        <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-md">
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
            <div>
              <h3 className="font-medium text-green-800">Magic Link Authentication</h3>
              <p className="text-sm text-green-600">
                You've clicked a magic link. You should be signed in automatically. 
                If not, please try signing in again.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-md">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-800">Authentication Error</h3>
              <p className="text-sm text-red-600">
                {errorDescription || error || "An authentication error occurred. Please try again."}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="mb-8 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">A.R.I.A.</h1>
        </div>
        <p className="text-muted-foreground text-center max-w-md">
          AI Reputation Intelligence Agent: Secure your brand's online reputation
        </p>
      </div>

      <Card className="w-full max-w-md border-2 border-primary shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            A.R.I.A. Security Login
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to access the A.R.I.A. admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          {getAuthTypeMessage()}
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default Authentication;
