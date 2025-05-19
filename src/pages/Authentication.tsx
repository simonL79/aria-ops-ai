
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { 
  SignIn,
  SignedIn, 
  SignedOut,
  useUser,
  useSignIn
} from "@clerk/clerk-react";
import { Shield, LogIn } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const Authentication = () => {
  const [isReady, setIsReady] = useState(false);
  const { isSignedIn, isLoaded } = useUser();
  const { signIn, setActive } = useSignIn();
  
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
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <Skeleton className="h-12 w-64 mb-4" />
        <Skeleton className="h-4 w-48" />
      </div>
    );
  }
  
  // If user is already signed in, redirect to dashboard
  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  // Handle click on the login button
  const handleLoginClick = async () => {
    try {
      toast.info("Opening login form...");
      
      // Attempt to focus the SignIn component for a better UX
      const signInElement = document.querySelector('.cl-rootBox');
      if (signInElement) {
        signInElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      console.log("Login button clicked");
      
      // Directly open Clerk's sign-in modal
      if (signIn) {
        await signIn.create({
          identifier: '',  // Empty identifier opens the modal with email field
          redirectUrl: '/dashboard'
        }).then(result => {
          if (result.status === 'complete') {
            // Login successful - handled by the SignIn component's redirect
            console.log("Sign in complete");
          } 
        }).catch(err => {
          console.error("Sign in error:", err);
          toast.error("Login failed. Please try again.");
        });
      } else {
        console.error("SignIn object not available");
        toast.error("Authentication service not available. Please try again later.");
      }
    } catch (error) {
      console.error("Error with login button:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="mb-8 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">A.R.I.A.</h1>
        </div>
        <p className="text-muted-foreground text-center max-w-md">
          AI Reputation Intelligence Agent: Secure your brand's online reputation with advanced threat intelligence and monitoring
        </p>
      </div>

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
              {/* SignIn component doesn't accept children, so we use it directly */}
              <SignIn routing="path" path="/signin" redirectUrl="/dashboard" />
              
              {/* Add explicit login button for better visibility */}
              <div className="flex flex-col items-center">
                <Button 
                  className="w-full" 
                  variant="default" 
                  size="lg"
                  onClick={handleLoginClick}
                >
                  <LogIn className="mr-2" />
                  Login to Dashboard
                </Button>
                <p className="text-center text-sm text-muted-foreground mt-2">
                  Use the form above or click this button to login
                </p>
              </div>
              
              {/* Add a text note below to indicate this is admin-only */}
              <p className="text-center text-sm text-muted-foreground">
                Admin access only. No new registrations permitted.
              </p>
            </div>
          </SignedOut>
        </CardContent>
      </Card>

      <SignedIn>
        <div className="mt-6">
          <p className="text-muted-foreground mb-2 text-center">You're already signed in</p>
          <Button asChild>
            <a href="/dashboard">Go to Dashboard</a>
          </Button>
        </div>
      </SignedIn>
    </div>
  );
};

export default Authentication;
