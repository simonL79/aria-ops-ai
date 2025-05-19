
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
        <Shield className={cn(logoSize.shield, shieldColor)} fill="currentColor" fillOpacity={0.05} strokeWidth={1.5} />
        <div className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 24 24" width="65%" height="65%" className={shieldSecondaryColor} strokeWidth={1.5}>
            <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.8" />
            <circle cx="7" cy="8" r="1.5" fill="currentColor" opacity="0.6" />
            <circle cx="17" cy="8" r="1.5" fill="currentColor" opacity="0.6" />
            <circle cx="7" cy="16" r="1.5" fill="currentColor" opacity="0.6" />
            <circle cx="17" cy="16" r="1.5" fill="currentColor" opacity="0.6" />
            <circle cx="12" cy="5" r="1.5" fill="currentColor" opacity="0.6" />
            <circle cx="12" cy="19" r="1.5" fill="currentColor" opacity="0.6" />
            <line x1="12" y1="12" x2="7" y2="8" stroke="currentColor" strokeWidth="0.7" />
            <line x1="12" y1="12" x2="17" y2="8" stroke="currentColor" strokeWidth="0.7" />
            <line x1="12" y1="12" x2="7" y2="16" stroke="currentColor" strokeWidth="0.7" />
            <line x1="12" y1="12" x2="17" y2="16" stroke="currentColor" strokeWidth="0.7" />
            <line x1="12" y1="12" x2="12" y2="5" stroke="currentColor" strokeWidth="0.7" />
            <line x1="12" y1="12" x2="12" y2="19" stroke="currentColor" strokeWidth="0.7" />
          </svg>
        </div>
      </div>
      <div className="flex items-baseline">
        <span className={cn('font-bold', logoSize.text, textColor)}>A.R.I.A</span>
        <span className={cn('font-medium', logoSize.trademark, textColor)}>™</span>
      </div>
    </div>
  );
};

export default Logo;
