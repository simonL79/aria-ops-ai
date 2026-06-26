
import { useState, useEffect } from "react";
import { Navigate, useLocation, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, AlertCircle, CheckCircle, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import LoginForm from "@/components/auth/LoginForm";
import SEO from "@/components/seo/SEO";

const PLAN_NAMES: Record<string, string> = {
  basic: "Personal Shield",
  individual: "Creator Shield",
  pro: "Business Shield",
};

const Authentication = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, isAdmin, isAdminLoading, isPortalUser, isPortalLoading } = useAuth();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const requestedFrom = location.state?.from?.pathname as string | undefined;
  const authType = searchParams.get('type');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  const planId = searchParams.get('plan');
  const redirect = searchParams.get('redirect');
  const isCheckout = !!planId;
  const planName = planId ? PLAN_NAMES[planId] ?? "your plan" : null;

  useEffect(() => {
    if (error) {
      console.error('Auth error from URL:', error, errorDescription);
    }
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [error, errorDescription]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // If already authenticated, route by intent
  if (isAuthenticated && !isAdminLoading && !isPortalLoading) {
    if (isCheckout && planId) {
      // Stash the plan so the pricing section can resume checkout automatically
      try {
        sessionStorage.setItem('resumeCheckoutPlan', planId);
      } catch {
        /* ignore */
      }
      const dest = redirect ? decodeURIComponent(redirect) : '/home#pricing';
      return <Navigate to={dest} replace />;
    }
    const dest = requestedFrom || (isAdmin ? '/admin/shield' : isPortalUser ? '/portal' : '/portal/no-access');
    return <Navigate to={dest} replace />;
  }

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <SEO title="Sign in — A.R.I.A™" description="Sign in to A.R.I.A™." path="/auth" noIndex />

      <div className="mb-8 flex flex-col items-center text-center">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">A.R.I.A.</h1>
        </div>
        {isCheckout ? (
          <p className="text-muted-foreground max-w-md">
            You're one step away from activating <span className="text-primary font-semibold">{planName}</span>.
            Create your account or sign in to continue securely to payment.
          </p>
        ) : (
          <p className="text-muted-foreground max-w-md">
            AI Reputation Intelligence Agent — secure your brand's online reputation.
          </p>
        )}
      </div>

      <Card className="w-full max-w-md border border-border shadow-lg bg-card">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-foreground">
            {isCheckout ? "Continue to checkout" : "Welcome back"}
          </CardTitle>
          <CardDescription className="text-center">
            {isCheckout
              ? `Sign in or create your account to subscribe to ${planName}.`
              : "Sign in to access your A.R.I.A. account."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {getAuthTypeMessage()}
          <LoginForm defaultSignUp={isCheckout} />
        </CardContent>
      </Card>

      {isCheckout && (
        <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
          <Check className="h-4 w-4 text-primary" />
          <span>Secure checkout · Cancel anytime · UK-based support</span>
        </div>
      )}
    </div>
  );
};

export default Authentication;
