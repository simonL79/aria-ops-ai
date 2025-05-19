
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const AuthLoadingState = () => {
  const [isLongLoading, setIsLongLoading] = useState(false);

  useEffect(() => {
    // If loading takes more than 3 seconds, show extended message
    const timer = setTimeout(() => {
      setIsLongLoading(true);
    }, 3000);
    
    return () => clearTimeout(timer);
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
        <div className="mt-8 text-center">
          <p className="text-amber-600 mb-4">Authentication is taking longer than expected.</p>
          <p className="text-sm text-gray-600 mb-4">This might be due to network issues or incorrect API credentials.</p>
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
