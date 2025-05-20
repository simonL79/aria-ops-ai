
import React from 'react';
import { cn } from '@/lib/utils';
import { Shield, Check } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface GDPRBadgeProps {
  variant?: 'default' | 'small' | 'icon';
  className?: string;
}

const GDPRBadge = ({ variant = 'default', className }: GDPRBadgeProps) => {
  const IconContent = (
    <div className={cn(
      "flex items-center gap-1.5 rounded-full",
      variant === 'small' ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm",
      "bg-emerald-100 text-emerald-800 border border-emerald-200",
      className
    )}>
      <Shield className={variant === 'small' ? "h-3 w-3" : "h-4 w-4"} />
      {variant !== 'icon' && (
        <>
          <span className="font-semibold">GDPR</span>
          <Check className={variant === 'small' ? "h-3 w-3" : "h-4 w-4"} />
        </>
      )}
    </div>
  );

  if (variant === 'icon') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {IconContent}
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">GDPR Compliant & EU Hosted</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return IconContent;
};

export default GDPRBadge;
