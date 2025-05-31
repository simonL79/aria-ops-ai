
import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ children, className }) => {
  return (
    <div className={cn(
      "responsive-container w-full min-h-screen",
      "px-1 sm:px-2 md:px-4 lg:px-6 xl:px-8",
      "py-1 sm:py-2 md:py-4 lg:py-6",
      "max-w-[100vw] overflow-x-hidden",
      className
    )}>
      <div className={cn(
        "responsive-content mx-auto w-full",
        "max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl",
        "space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-6"
      )}>
        {children}
      </div>
    </div>
  );
};

export default ResponsiveLayout;
