
import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import LoginForm from "@/components/auth/LoginForm";

const Authentication = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const from = location.state?.from || "/dashboard";
  
  useEffect(() => {
    // Small timeout to prevent flash
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
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
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default Authentication;
