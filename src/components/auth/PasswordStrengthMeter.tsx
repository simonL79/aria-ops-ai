import { validatePassword, type PasswordStrength } from '@/utils/passwordStrength';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  password: string;
  className?: string;
}

const STRENGTH_LABEL: Record<PasswordStrength, string> = {
  weak: 'Weak',
  fair: 'Fair',
  good: 'Good',
  strong: 'Strong',
};

const STRENGTH_BAR: Record<PasswordStrength, string> = {
  weak: 'w-1/4 bg-destructive',
  fair: 'w-2/4 bg-yellow-500',
  good: 'w-3/4 bg-blue-500',
  strong: 'w-full bg-green-500',
};

const STRENGTH_TEXT: Record<PasswordStrength, string> = {
  weak: 'text-destructive',
  fair: 'text-yellow-600 dark:text-yellow-500',
  good: 'text-blue-600 dark:text-blue-500',
  strong: 'text-green-600 dark:text-green-500',
};

export const PasswordStrengthMeter = ({ password, className }: Props) => {
  if (!password) return null;
  const result = validatePassword(password);

  return (
    <div className={cn('space-y-2 text-sm', className)}>
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div className={cn('h-full transition-all', STRENGTH_BAR[result.strength])} />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Password strength</span>
        <span className={cn('font-medium', STRENGTH_TEXT[result.strength])}>
          {STRENGTH_LABEL[result.strength]}
        </span>
      </div>
      {(result.errors.length > 0 || result.suggestions.length > 0) && (
        <ul className="space-y-1">
          {result.errors.map((err) => (
            <li key={err} className="flex items-center gap-2 text-destructive">
              <X className="h-3.5 w-3.5 shrink-0" />
              <span>{err}</span>
            </li>
          ))}
          {result.suggestions.map((s) => (
            <li key={s} className="flex items-center gap-2 text-muted-foreground">
              <Check className="h-3.5 w-3.5 shrink-0" />
              <span>{s}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
