
import { Skeleton } from "@/components/ui/skeleton";

const AuthLoadingState = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center mb-8">
        <p className="text-lg font-medium text-gray-700 mb-2">Loading authentication...</p>
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
      </div>
      <Skeleton className="h-12 w-64 mb-4" />
      <Skeleton className="h-4 w-48 mb-2" />
      <Skeleton className="h-4 w-36" />
    </div>
  );
};

export default AuthLoadingState;
