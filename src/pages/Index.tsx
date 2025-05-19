
import { Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center">
        <Skeleton className="h-12 w-64 mb-4" />
        <Skeleton className="h-4 w-48" />
      </div>
    );
  }

  return isSignedIn ? <Navigate to="/dashboard" replace /> : <Navigate to="/signin" replace />;
};

export default Index;
