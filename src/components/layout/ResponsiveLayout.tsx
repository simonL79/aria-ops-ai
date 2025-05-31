
import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ children, className }) => {
  return (
    <div className={cn(
      "min-h-screen bg-corporate-dark",
      "px-4 sm:px-6 lg:px-8", // Responsive padding
      "py-4 sm:py-6 lg:py-8",  // Responsive padding
      className
    )}>
      <div className={cn(
        "mx-auto",
        "max-w-full sm:max-w-7xl", // Responsive max width
        "space-y-4 sm:space-y-6 lg:space-y-8" // Responsive spacing
      )}>
        {children}
      </div>
    </div>
  );
};

export default ResponsiveLayout;
