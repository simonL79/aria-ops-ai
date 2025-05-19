
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

  // Handle direct email signin (this is what we'll use when a user enters credentials)
  const handleSignInWithEmail = async (email: string, password: string) => {
    try {
      if (!signIn) {
        toast.error("Authentication service not available");
        return;
      }
      
      const result = await signIn.create({
        identifier: email,
        password,
      });
      
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        toast.success("Login successful");
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("Error signing in:", error);
      toast.error("Login failed. Please check your credentials and try again.");
    }
  };

  // This function will now help users get started with signing in using our custom form
  const handleLoginClick = () => {
    // Instead of trying to interact with Clerk DOM elements, we'll show a login form
    toast.info("Please enter your credentials in the form below");
    
    // Scroll to the sign-in component
    const signInElement = document.getElementById('clerk-sign-in');
    if (signInElement) {
      signInElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Apply focus-grabbing styling
      signInElement.classList.add('highlight-container');
      
      // Add clear instructions for the user
      toast.success("Enter your email and password to sign in", {
        duration: 5000
      });
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
              {/* Prominent Login button at the top with enhanced visibility */}
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium animate-pulse" 
                variant="default" 
                size="lg"
                onClick={handleLoginClick}
              >
                <LogIn className="mr-2" />
                Login to Dashboard
              </Button>
              
              {/* Add CSS for animation using standard style tag */}
              <style>
                {`
                  .highlight-container {
                    animation: pulse 2s infinite;
                    border: 2px solid #3b82f6;
                    border-radius: 8px;
                    padding: 8px;
                  }
                  @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
                    70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
                  }
                `}
              </style>
              
              {/* Make the Clerk container more visible with distinct styling */}
              <div id="clerk-sign-in" className="clerk-form-container border-2 border-primary rounded-lg p-4">
                <SignIn 
                  path="/signin"
                  routing="path" 
                  signUpUrl="/signin"
                  afterSignInUrl="/dashboard"
                  afterSignUpUrl="/dashboard"
                />
              </div>
              
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
