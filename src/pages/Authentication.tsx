
import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthenticationForm from "@/components/auth/AuthenticationForm";
import AuthLoadingState from "@/components/auth/AuthLoadingState";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const Authentication = () => {
  const [isReady, setIsReady] = useState(false);
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
  
  // If already authenticated, redirect to the dashboard
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <AuthHeader />
      
      <div className="w-full max-w-md text-center mb-8">
        <Button 
          size="lg" 
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 transition-colors text-lg font-semibold"
          onClick={scrollToAuthCard}
        >
          <LogIn className="mr-2 h-5 w-5" />
          <span>Secure Login</span>
        </Button>
        <p className="mt-2 text-sm text-gray-500">Access your A.R.I.A. security dashboard</p>
      </div>

      <Card id="auth-card" className="w-full max-w-md border-2 border-primary shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            A.R.I.A. Security Login
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to access your A.R.I.A. dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <AuthenticationForm />
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-4 text-center text-sm text-gray-500">
        <p>Demo Credentials:</p>
        <div className="bg-blue-50 p-2 rounded mt-1">
          <p><strong>Primary Admin:</strong> simonlindsay7988@gmail.com / Kaypetdel123</p>
          <p><strong>Alt Admin:</strong> admin@example.com / password123</p>
          <p><strong>User:</strong> user@example.com / password123</p>
        </div>
      </div>
    </div>
  );
};

export default Authentication;
