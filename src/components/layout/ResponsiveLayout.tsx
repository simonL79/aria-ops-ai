
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
      "px-2 sm:px-4 lg:px-6 xl:px-8",
      "py-2 sm:py-4 lg:py-6",
      "max-w-[100vw] overflow-x-hidden",
      className
    )}>
      <div className={cn(
        "responsive-content mx-auto",
        "max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-full",
        "space-y-3 sm:space-y-4 lg:space-y-6"
      )}>
        {children}
      </div>
    </div>
  );
};

export default ResponsiveLayout;
