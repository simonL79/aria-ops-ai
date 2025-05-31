
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface PageLoaderProps {
  message?: string;
}

const PageLoader: React.FC<PageLoaderProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="min-h-screen bg-corporate-dark p-6">
      <div className="space-y-6">
        <Skeleton className="h-16 bg-corporate-darkSecondary" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-32 bg-corporate-darkSecondary" />
          <Skeleton className="h-32 bg-corporate-darkSecondary" />
          <Skeleton className="h-32 bg-corporate-darkSecondary" />
        </div>
        <Skeleton className="h-96 bg-corporate-darkSecondary" />
        <div className="text-center">
          <p className="text-corporate-lightGray">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
