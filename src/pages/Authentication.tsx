
import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthenticationForm from "@/components/auth/AuthenticationForm";
import AuthLoadingState from "@/components/auth/AuthLoadingState";
import SignedInRedirect from "@/components/auth/SignedInRedirect";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const Authentication = () => {
  const [isReady, setIsReady] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";
  
  useEffect(() => {
    // Small timeout to prevent flash
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [isLoading, isAuthenticated]);
  
  // Set a timeout to show an error if loading takes too long
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        setLoadingTimeout(true);
      }
    }, 7000); // 7 seconds timeout
    
    return () => clearTimeout(timer);
  }, [isLoading]);
  
  const handleRefresh = () => {
    window.location.reload();
  };
  
  // If still loading and hasn't timed out, show a loading state
  if ((isLoading || !isReady) && !loadingTimeout) {
    return <AuthLoadingState />;
  }
  
  // If loading has timed out, show an error message
  if ((isLoading || !isReady) && loadingTimeout) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <AuthHeader />
        
        <Alert variant="destructive" className="mb-6 max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Authentication service is not responding. This might be due to an incorrect API key or network issues.
          </AlertDescription>
        </Alert>
        
        <Button 
          onClick={handleRefresh}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Page
        </Button>
      </div>
    );
  }
  
  // If already authenticated, redirect to the dashboard
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <AuthHeader />

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            A.R.I.A. Security Login
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to access your A.R.I.A. dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignedOut>
            <div className="space-y-6">
              <AuthenticationForm />
            </div>
          </SignedOut>
          <SignedIn>
            <SignedInRedirect redirectTo="/dashboard">
              <div className="text-center">
                <p className="mb-4">You are already signed in.</p>
                <Button asChild>
                  <a href="/dashboard">Go to Dashboard</a>
                </Button>
              </div>
            </SignedInRedirect>
          </SignedIn>
        </CardContent>
      </Card>
    </div>
  );
};

export default Authentication;
