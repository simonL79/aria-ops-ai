
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { 
  SignIn, 
  SignUp, 
  SignedIn, 
  SignedOut,
  useUser
} from "@clerk/clerk-react";
import { Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

const Authentication = () => {
  const [activeTab, setActiveTab] = useState<string>("signin");
  const { isSignedIn, isLoaded } = useUser();
  const [isReady, setIsReady] = useState(false);
  
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

  // Handle tab change without form submissions
  const handleTabChange = (value: string) => {
    setActiveTab(value);
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
            {activeTab === "signin" ? "Sign in to your account" : "Create an account"}
          </CardTitle>
          <CardDescription className="text-center">
            {activeTab === "signin" 
              ? "Enter your credentials to access your dashboard" 
              : "Create your A.R.I.A. account to get started"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="signin" type="button">Sign In</TabsTrigger>
              <TabsTrigger value="signup" type="button">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <SignIn 
                routing="path" 
                path="/signin"
                signUpUrl="/signup"
                fallbackRedirectUrl="/dashboard"
              />
            </TabsContent>
            <TabsContent value="signup">
              <SignUp 
                routing="path" 
                path="/signup"
                signInUrl="/signin"
                fallbackRedirectUrl="/dashboard"
              />
            </TabsContent>
          </Tabs>
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
