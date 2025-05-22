
import { useState, useEffect } from "react";
import { Navigate, useLocation, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthenticationForm from "@/components/auth/AuthenticationForm";
import AuthLoadingState from "@/components/auth/AuthLoadingState";
import { LogIn, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const Authentication = () => {
  const [isReady, setIsReady] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const from = location.state?.from?.pathname || "/dashboard";
  
  // Detect if we're in recovery mode from Supabase link
  const isRecoveryMode = searchParams.get("type") === "recovery";
  
  useEffect(() => {
    // Small timeout to prevent flash
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [isLoading, isAuthenticated]);
  
  const scrollToAuthCard = () => {
    const authCard = document.getElementById('auth-card');
    if (authCard) {
      authCard.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // If still loading and hasn't timed out, show a loading state
  if ((isLoading || !isReady)) {
    return <AuthLoadingState />;
  }
  
  // If already authenticated and not doing a password reset, redirect to the dashboard
  if (isAuthenticated && !isRecoveryMode) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <AuthHeader />
      
      {!isRecoveryMode && (
        <div className="w-full max-w-md text-center mb-8">
          <Button 
            size="lg" 
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 transition-colors text-lg font-semibold"
            onClick={scrollToAuthCard}
          >
            <LogIn className="mr-2 h-5 w-5" />
            <span>Staff Login Only</span>
          </Button>
          <p className="mt-2 text-sm text-gray-500">Access your A.R.I.A. security dashboard</p>
          
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
            <div className="flex items-center text-amber-700 mb-1">
              <ShieldAlert className="h-4 w-4 mr-1" />
              <span className="font-medium">Internal Access Only</span>
            </div>
            <p className="text-xs text-amber-800">
              This system is for authorized staff only. Customer reports are delivered externally.
            </p>
          </div>
        </div>
      )}

      <Card id="auth-card" className="w-full max-w-md border-2 border-primary shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            A.R.I.A. Security {isRecoveryMode ? "Password Reset" : "Login"}
          </CardTitle>
          <CardDescription className="text-center">
            {isRecoveryMode 
              ? "Set your new password below" 
              : "Sign in to access the A.R.I.A. admin dashboard"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <AuthenticationForm />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Authentication;
