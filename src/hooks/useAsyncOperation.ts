
import { useState, useCallback } from 'react';
import { useErrorHandler } from './useErrorHandler';

interface AsyncOperationState {
  isLoading: boolean;
  error: string | null;
}

export const useAsyncOperation = () => {
  const [state, setState] = useState<AsyncOperationState>({
    isLoading: false,
    error: null
  });
  
  const { handleError } = useErrorHandler();

  const execute = useCallback(async <T>(
    operation: () => Promise<T>,
    options?: { showErrorToast?: boolean }
  ): Promise<T | null> => {
    setState({ isLoading: true, error: null });
    
    try {
      const result = await operation();
      setState({ isLoading: false, error: null });
      return result;
    } catch (error) {
      const errorMessage = handleError(error, {
        showToast: options?.showErrorToast ?? true
      });
      setState({ isLoading: false, error: errorMessage });
      return null;
    }
  }, [handleError]);

  const reset = useCallback(() => {
    setState({ isLoading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset
  };
};
