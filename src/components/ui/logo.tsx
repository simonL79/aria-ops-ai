
import React from 'react';
import { Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  variant?: 'default' | 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Logo = ({ variant = 'default', size = 'md', className }: LogoProps) => {
  const textColor = {
    default: 'text-premium-black',
    light: 'text-white',
    dark: 'text-premium-black'
  }[variant];

  const shieldColor = {
    default: 'text-premium-black',
    light: 'text-white',
    dark: 'text-premium-black'
  }[variant];

  const shieldSecondaryColor = {
    default: 'text-premium-silver',
    light: 'text-premium-silver',
    dark: 'text-premium-silver'
  }[variant];

  const logoSize = {
    sm: {
      container: 'gap-1',
      shield: 'h-4 w-4',
      text: 'text-base',
      trademark: 'text-xs'
    },
    md: {
      container: 'gap-2',
      shield: 'h-5 w-5',
      text: 'text-xl',
      trademark: 'text-xs'
    },
    lg: {
      container: 'gap-2.5',
      shield: 'h-8 w-8',
      text: 'text-2xl',
      trademark: 'text-sm'
    }
  }[size];

  return (
    <div className={cn('flex items-center', logoSize.container, className)}>
      <div className="relative">
        <Shield className={cn(logoSize.shield, shieldColor)} fill="currentColor" fillOpacity={0.1} />
        <span className="absolute inset-0 flex items-center justify-center font-bold text-xs text-primary">A</span>
      </div>
      <div className="flex items-baseline">
        <span className={cn('font-bold', logoSize.text, textColor)}>ARIA</span>
        <span className={cn('font-medium', logoSize.trademark, textColor)}>™</span>
      </div>
    </div>
  );
};

export default Logo;
