// Client-side password strength validation.
// Mitigates the absence of Supabase Pro's HaveIBeenPwned check by enforcing
// strong password rules + blocking the most common leaked passwords locally.

// Top common/leaked passwords (subset). Kept short for bundle size — server-side
// HIBP via Supabase Pro is the proper full check; this catches the obvious ones.
const COMMON_PASSWORDS = new Set([
  'password', 'password1', 'password123', '12345678', '123456789', '1234567890',
  'qwerty', 'qwerty123', 'qwertyuiop', 'abc123', 'abcd1234', 'iloveyou',
  'admin', 'admin123', 'administrator', 'letmein', 'welcome', 'welcome1',
  'monkey', 'dragon', 'master', 'sunshine', 'princess', 'football', 'baseball',
  'superman', 'batman', 'trustno1', 'starwars', 'passw0rd', 'p@ssw0rd',
  '11111111', '00000000', '12341234', 'changeme', 'login', 'access',
]);

export type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong';

export interface PasswordValidation {
  isValid: boolean;
  strength: PasswordStrength;
  score: number; // 0-4
  errors: string[];
  suggestions: string[];
}

export function validatePassword(password: string): PasswordValidation {
  const errors: string[] = [];
  const suggestions: string[] = [];

  if (password.length < 12) {
    errors.push('Must be at least 12 characters');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Must include a lowercase letter');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Must include an uppercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Must include a number');
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Must include a symbol');
  }
  if (COMMON_PASSWORDS.has(password.toLowerCase())) {
    errors.push('This password is commonly leaked — choose another');
  }
  if (/(.)\1{2,}/.test(password)) {
    suggestions.push('Avoid 3+ repeated characters in a row');
  }
  if (/^(?:0123|1234|2345|3456|4567|5678|6789|abcd|qwer|asdf)/i.test(password)) {
    suggestions.push('Avoid sequential characters at the start');
  }

  // Score: 1 point each for length≥12, length≥16, mixed case+digit+symbol, no common, no patterns
  let score = 0;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;
  if (!COMMON_PASSWORDS.has(password.toLowerCase()) && password.length > 0) score++;
  if (suggestions.length === 0 && password.length >= 12) score = Math.min(4, score + 1);

  const strength: PasswordStrength =
    score <= 1 ? 'weak' : score === 2 ? 'fair' : score === 3 ? 'good' : 'strong';

  return {
    isValid: errors.length === 0,
    strength,
    score,
    errors,
    suggestions,
  };
}
