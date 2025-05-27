
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: any, defaultMessage = 'An error occurred') => {
  console.error('API Error:', error);
  
  const message = error?.message || defaultMessage;
  toast.error(message);
  
  return new ApiError(message, error?.status, error?.code);
};

export const apiCall = async <T>(
  operation: () => Promise<{ data: T; error: any }>,
  errorMessage = 'Operation failed'
): Promise<T> => {
  try {
    const result = await operation();
    const { data, error } = result;
    
    if (error) {
      throw handleApiError(error, errorMessage);
    }
    
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw handleApiError(error, errorMessage);
  }
};

// Specific API functions
export const submitScanRequest = async (formData: {
  full_name: string;
  email: string;
}) => {
  return apiCall(
    async () => {
      const result = await supabase
        .from('reputation_scan_submissions')
        .insert([{ ...formData, keywords: '', status: 'new' }]);
      return result;
    },
    'Failed to submit scan request'
  );
};

export const submitLeadMagnet = async (formData: {
  name: string;
  email: string;
  lead_magnet: string;
}) => {
  return apiCall(
    async () => {
      const result = await supabase
        .from('lead_magnets')
        .insert([{ ...formData, status: 'new' }]);
      return result;
    },
    'Failed to submit lead magnet'
  );
};
