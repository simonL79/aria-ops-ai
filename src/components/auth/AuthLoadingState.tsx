
import { Skeleton } from "@/components/ui/skeleton";

const AuthLoadingState = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <Skeleton className="h-12 w-64 mb-4" />
      <Skeleton className="h-4 w-48" />
    </div>
  );
};

export default AuthLoadingState;
