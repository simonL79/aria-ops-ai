
import { useCallback } from 'react';
import { toast } from 'sonner';
import { ApiError } from '@/lib/api';

interface ErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  defaultMessage?: string;
}

export const useErrorHandler = () => {
  const handleError = useCallback((
    error: unknown,
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showToast = true,
      logError = true,
      defaultMessage = 'An unexpected error occurred'
    } = options;

    let message = defaultMessage;
    
    if (error instanceof ApiError) {
      message = error.message;
    } else if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    }

    if (logError) {
      console.error('Error handled:', error);
    }

    if (showToast) {
      toast.error(message);
    }

    return message;
  }, []);

  return { handleError };
};
