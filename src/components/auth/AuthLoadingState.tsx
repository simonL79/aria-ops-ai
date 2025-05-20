
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const AuthLoadingState = () => {
  const [isLongLoading, setIsLongLoading] = useState(false);
  const [showClerkInfo, setShowClerkInfo] = useState(false);
  const [isApiKeyMissing, setIsApiKeyMissing] = useState(false);

  useEffect(() => {
    // Check if the API key is missing
    const isMissingKey = !import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
    setIsApiKeyMissing(isMissingKey);
    
    // If loading takes more than 3 seconds, show extended message
    const timer = setTimeout(() => {
      setIsLongLoading(true);
    }, 3000);
    
    // If loading takes more than 5 seconds, show API key info
    const clerkTimer = setTimeout(() => {
      setShowClerkInfo(true);
    }, 5000);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(clerkTimer);
    };
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  // If we know the API key is missing, show that message immediately
  if (isApiKeyMissing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription className="font-semibold">
              Authentication Configuration Notice
            </AlertDescription>
          </Alert>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Using Test Credentials</h2>
            <p className="text-gray-600 mb-4">
              Your application is currently using test authentication credentials. This is fine for development but may cause issues in production.
            </p>
            
            <div className="bg-amber-50 p-4 rounded-md border border-amber-200 mb-4">
              <p className="font-medium mb-2">If you encounter login issues:</p>
              <ol className="list-decimal pl-5 text-sm space-y-2">
                <li>Try refreshing the page</li>
                <li>Ensure you're using the correct credentials</li>
                <li>Contact support if problems persist</li>
              </ol>
            </div>
            
            <Button 
              onClick={handleRefresh}
              className="flex items-center gap-2 w-full"
            >
              <RefreshCw className="h-4 w-4" />
              Continue to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center mb-8">
        <p className="text-lg font-medium text-gray-700 mb-2">Loading authentication...</p>
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
      </div>
      <Skeleton className="h-12 w-64 mb-4" />
      <Skeleton className="h-4 w-48 mb-2" />
      <Skeleton className="h-4 w-36" />

      {isLongLoading && (
        <div className="mt-8 text-center max-w-md">
          {showClerkInfo && (
            <Alert variant="default" className="mb-4 bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 mr-2 text-blue-500" />
              <AlertDescription>
                Authentication is taking longer than expected.
              </AlertDescription>
            </Alert>
          )}
          
          <p className="text-sm text-gray-600 mb-4">Please wait while we securely authenticate you...</p>
          
          {showClerkInfo && (
            <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mb-4 text-left">
              <p className="font-medium mb-2">If you continue to experience delays:</p>
              <ol className="list-decimal pl-5 text-sm space-y-2">
                <li>Check your network connection</li>
                <li>Try refreshing the page</li>
                <li>Clear your browser cache and cookies</li>
              </ol>
            </div>
          )}
          
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Page
          </Button>
        </div>
      )}
    </div>
  );
};

export default AuthLoadingState;
