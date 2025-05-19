
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

  // Direct login button handler that focuses on the form
  const handleLoginClick = () => {
    toast.info("Opening sign-in form...");
    
    setTimeout(() => {
      // Try different selectors to find the Clerk form elements
      const emailInput = document.querySelector('input[name="identifier"], input[type="email"]');
      const signInButton = document.querySelector('.cl-formButtonPrimary, .cl-button-root');
      const formContainer = document.querySelector('.cl-card, .cl-formContainer');
      
      if (emailInput instanceof HTMLElement) {
        // Focus on the email input if found
        emailInput.focus();
        toast.success("Please enter your email address");
      } else if (signInButton instanceof HTMLElement) {
        // Click the sign-in button if found
        signInButton.click();
        toast.success("Please complete the sign-in process");
      } else if (formContainer instanceof HTMLElement) {
        // Make the form container visible and bring focus to it
        formContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        formContainer.classList.add('highlight-container');
        toast.info("Please use the sign-in form below");
      } else {
        // If we can't find any elements, provide instructions
        toast.info("Click the 'Login to Dashboard' button again to activate the form");
        
        // Try to initialize the Clerk form
        const clerkRoot = document.querySelector('#cl-root');
        if (clerkRoot instanceof HTMLElement) {
          clerkRoot.click();
        }
      }
    }, 200); // Increased timeout to ensure Clerk components are fully rendered
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
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium" 
                variant="default" 
                size="lg"
                onClick={handleLoginClick}
              >
                <LogIn className="mr-2" />
                Login to Dashboard
              </Button>
              
              {/* Add CSS to highlight the Clerk component */}
              <style jsx>{`
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
              `}</style>
              
              {/* Use standard SignIn component with clear redirectUrl */}
              <div id="clerk-sign-in" className="clerk-form-container">
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
