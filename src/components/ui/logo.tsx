
import React from 'react';
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
    default: 'text-premium-silver',
    light: 'text-white',
    dark: 'text-premium-silver'
  }[variant];

  const logoSize = {
    sm: {
      container: 'gap-1',
      shield: 'h-4 w-4',
      text: 'text-base',
      trademark: 'text-xs',
      subtitle: 'text-[8px] leading-tight'
    },
    md: {
      container: 'gap-2',
      shield: 'h-6 w-6',
      text: 'text-xl',
      trademark: 'text-xs',
      subtitle: 'text-[10px] leading-tight'
    },
    lg: {
      container: 'gap-2.5',
      shield: 'h-10 w-10',
      text: 'text-2xl',
      trademark: 'text-sm',
      subtitle: 'text-xs leading-tight'
    }
  }[size];

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className={cn('flex items-center', logoSize.container)}>
        <div className="relative">
          <svg 
            viewBox="0 0 24 24" 
            width={logoSize.shield === 'h-4 w-4' ? "16" : logoSize.shield === 'h-6 w-6' ? "24" : "40"} 
            height={logoSize.shield === 'h-4 w-4' ? "16" : logoSize.shield === 'h-6 w-6' ? "24" : "40"} 
            className={cn(shieldColor)}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          >
            <path d="M12 2L4 6v6c0 5.1 3.43 9.8 8 11 4.57-1.2 8-5.9 8-11V6l-8-4z" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" fillOpacity="0.6" />
            <circle cx="12" cy="7" r="1" fill="currentColor" fillOpacity="0.6" />
            <circle cx="17" cy="12" r="1" fill="currentColor" fillOpacity="0.6" />
            <circle cx="12" cy="17" r="1" fill="currentColor" fillOpacity="0.6" />
            <circle cx="7" cy="12" r="1" fill="currentColor" fillOpacity="0.6" />
            <line x1="12" y1="12" x2="12" y2="7" stroke="currentColor" />
            <line x1="12" y1="12" x2="17" y2="12" stroke="currentColor" />
            <line x1="12" y1="12" x2="12" y2="17" stroke="currentColor" />
            <line x1="12" y1="12" x2="7" y2="12" stroke="currentColor" />
            <line x1="12" y1="7" x2="17" y2="12" stroke="currentColor" />
            <line x1="17" y1="12" x2="12" y2="17" stroke="currentColor" />
            <line x1="12" y1="17" x2="7" y2="12" stroke="currentColor" />
            <line x1="7" y1="12" x2="12" y2="7" stroke="currentColor" />
          </svg>
        </div>
        <div className="flex flex-col items-start">
          <div className="flex items-baseline">
            <span className={cn('font-bold', logoSize.text, textColor)}>A.R.I.A</span>
            <span className={cn('font-medium', logoSize.trademark, textColor)}>™</span>
          </div>
          {size !== 'sm' && (
            <div className={cn('flex flex-col text-premium-silver uppercase tracking-wider', logoSize.subtitle)}>
              <span>AI REPUTATION</span>
              <span>INTELLIGENCE AGENT</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Logo;
