
import React from 'react';
import { cn } from '@/lib/utils';

interface QAResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const QAResponsiveLayout: React.FC<QAResponsiveLayoutProps> = ({ 
  children, 
  className 
}) => {
  return (
    <div className={cn(
      // Base responsive container
      "w-full min-h-screen",
      // Responsive padding with proper scaling
      "px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10",
      "py-2 sm:py-4 md:py-6 lg:py-8",
      // Prevent horizontal overflow
      "max-w-full overflow-x-hidden",
      // Responsive spacing between sections
      "space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8",
      className
    )}>
      <div className={cn(
        // Responsive max-width with proper breakpoints
        "w-full mx-auto",
        "max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[1600px]",
        // Ensure content doesn't break on small screens
        "min-w-0"
      )}>
        {children}
      </div>
    </div>
  );
};

export default QAResponsiveLayout;
