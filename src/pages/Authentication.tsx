
import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthenticationForm from "@/components/auth/AuthenticationForm";
import AuthLoadingState from "@/components/auth/AuthLoadingState";
import SignedInRedirect from "@/components/auth/SignedInRedirect";

const Authentication = () => {
  const [isReady, setIsReady] = useState(false);
  const { isSignedIn, isLoaded } = useUser();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";
  
  useEffect(() => {
    if (isLoaded) {
      // Small timeout to prevent flash
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isLoaded]);
  
  // If still loading, show a loading state
  if (!isLoaded || !isReady) {
    return <AuthLoadingState />;
  }
  
  // If user is already signed in, redirect to dashboard
  if (isSignedIn) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <AuthHeader />

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Admin Login
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignedOut>
            <div className="space-y-6">
              <AuthenticationForm />
              <p className="text-center text-sm text-muted-foreground">
                Admin access only. No new registrations permitted.
              </p>
            </div>
          </SignedOut>
        </CardContent>
      </Card>

      <SignedIn>
        <SignedInRedirect />
      </SignedIn>
    </div>
  );
};

export default Authentication;
