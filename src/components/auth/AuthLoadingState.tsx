
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const AuthLoadingState = () => {
  const [isLongLoading, setIsLongLoading] = useState(false);
  const [showClerkInfo, setShowClerkInfo] = useState(false);

  useEffect(() => {
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
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>
              Authentication is taking longer than expected.
            </AlertDescription>
          </Alert>
          
          <p className="text-sm text-gray-600 mb-4">This might be due to network issues or incorrect API credentials.</p>
          
          {showClerkInfo && (
            <div className="bg-amber-50 p-4 rounded-md border border-amber-200 mb-4 text-left">
              <p className="font-medium mb-2">Troubleshooting steps:</p>
              <ol className="list-decimal pl-5 text-sm space-y-2">
                <li>Ensure you have set a valid <code className="bg-gray-100 px-1 py-0.5 rounded">VITE_CLERK_PUBLISHABLE_KEY</code> environment variable</li>
                <li>Check that your Clerk instance is properly configured and online</li>
                <li>Verify that your browser is not blocking authentication requests</li>
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
