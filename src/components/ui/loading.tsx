
import React from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export const LoadingSpinner as LoadingSpinnerExport = LoadingSpinner;

export const Loading = ({ message = 'Loading...', className }: { message?: string; className?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <LoadingSpinner size="lg" text={message} className={className} />
    </div>
  );
};

export default Loading;
