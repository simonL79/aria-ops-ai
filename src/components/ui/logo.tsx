
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
      container: 'gap-1',
      logo: 'h-6',
      subtitle: 'text-[8px] leading-tight'
    },
    md: {
      container: 'gap-2',
      logo: 'h-10',
      subtitle: 'text-[10px] leading-tight'
    },
    lg: {
      container: 'gap-2.5',
      logo: 'h-16',
      subtitle: 'text-xs leading-tight'
    },
    xl: {
      container: 'gap-3',
      logo: 'h-32',
      subtitle: 'text-sm leading-tight'
    },
    '10x': {
      container: 'gap-4',
      logo: 'h-80', // approximately 10x the md size
      subtitle: 'text-lg leading-tight'
    }
  }[size];
  
  const textColor = variant === 'light' ? 'text-white' : 'text-premium-silver';

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className={cn('flex items-center', logoSize.container)}>
        <img 
          src="/lovable-uploads/9d33eab3-cb10-4fcc-8737-5d64791f5222.png" 
          alt="A.R.I.A Logo" 
          className={cn(logoSize.logo, 'max-w-full')}
        />
      </div>
    </div>
  );
};

export default Logo;
