
export interface DataRequestSubmission {
  requestType: 'access' | 'delete' | 'rectify' | 'restrict';
  fullName: string;
  email: string;
  identifiers?: string;
  details?: string;
}

export interface DataRequestResponse {
  success: boolean;
  message: string;
  referenceId?: string;
  estimatedCompletionDays?: number;
}

/**
 * Helper utility to format and handle GDPR data requests
 */
export const submitDataRequest = async (
  request: DataRequestSubmission
): Promise<DataRequestResponse> => {
  try {
    // In a real implementation, this would call a backend API
    // For now, we'll simulate a successful submission with a 500ms delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate a fake reference ID using current timestamp and random digits
    const referenceId = `REQ-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
    
    return {
      success: true,
      message: `Your ${request.requestType} request has been submitted successfully.`,
      referenceId,
      estimatedCompletionDays: 30, // GDPR requires response within 30 days
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
};

/**
 * Validates that a data request submission contains all required fields
 */
export const validateDataRequest = (request: DataRequestSubmission): { 
  valid: boolean, 
  errors: string[] 
} => {
  const errors: string[] = [];
  
  if (!request.fullName) errors.push('Full name is required');
  if (!request.email) errors.push('Email address is required');
  if (!request.email.includes('@')) errors.push('Email address is invalid');
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Creates a properly formatted data export in JSON format
 */
export const createGDPRDataExport = (userId: string, userData: any): string => {
  const exportData = {
    metadata: {
      exportDate: new Date().toISOString(),
      dataSubject: userId,
      exportFormat: 'JSON',
      dataController: 'A.R.I.A™ Operations',
      contactEmail: 'dpo@ariaops.co.uk'
    },
    userProfile: userData.profile || {},
    userContent: userData.content || [],
    scanHistory: userData.scans || [],
    reportHistory: userData.reports || []
  };
  
  return JSON.stringify(exportData, null, 2);
};
