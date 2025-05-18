
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

interface AlertSkeletonProps {
  count?: number;
}

const AlertSkeleton = ({ count = 3 }: AlertSkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, item) => (
        <div key={item}>
          <div className="p-4">
            <div className="flex justify-between mb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="h-3 w-32 mb-2" />
            <Skeleton className="h-4 w-full mb-3" />
            <Skeleton className="h-4 w-11/12 mb-2" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-36" />
            </div>
          </div>
          {item < count - 1 && <Separator />}
        </div>
      ))}
    </>
  );
};

export default AlertSkeleton;
