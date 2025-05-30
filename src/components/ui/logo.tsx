
import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  variant?: 'default' | 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '10x';
  className?: string;
}

const Logo = ({ variant = 'default', size = 'md', className }: LogoProps) => {
  const logoSize = {
    sm: {
      logo: 'h-6'
    },
    md: {
      logo: 'h-10'
    },
    lg: {
      logo: 'h-16'
    },
    xl: {
      logo: 'h-32'
    },
    '10x': {
      logo: 'h-80'
    }
  }[size];

  return (
    <div className={cn('flex items-center', className)}>
      <img 
        src="/lovable-uploads/37370275-bf62-4eab-b0e3-e184ce3fa142.png" 
        alt="A.R.I.A Logo" 
        className={cn(logoSize.logo, 'max-w-full')}
      />
    </div>
  );
};

export default Logo;
