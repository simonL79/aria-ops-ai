
import { makeAriaIngestRequest } from './secureApiService';
import { toast } from 'sonner';

export interface AriaIngestRequest {
  content: string;
  platform: string;
  url: string;
  severity?: 'low' | 'medium' | 'high';
  threat_type?: string;
  source_type?: string;
  confidence_score?: number;
  potential_reach?: number;
  test?: boolean;
}

export interface AriaIngestResponse {
  success?: boolean;
  test?: boolean;
  payload: {
    content: string;
    platform: string;
    url: string;
    detected_entities: Array<{
      name: string;
      type: 'PERSON' | 'ORG' | 'SOCIAL';
    }>;
    risk_entity_name: string | null;
    risk_entity_type: string | null;
    severity: string;
    threat_type: string | null;
    source_type: string;
    status: string;
    confidence_score: number;
    sentiment: number;
    potential_reach: number;
  };
  inserted?: any;
  message?: string;
}

/**
 * Submit content to ARIA ingest pipeline for processing and entity extraction
 */
export const submitToAriaIngest = async (request: AriaIngestRequest): Promise<AriaIngestResponse | null> => {
  try {
    console.log('Submitting to ARIA ingest:', request);
    
    const response = await makeAriaIngestRequest(request);
    
    if (response.success || response.test) {
      if (response.test) {
        toast.success('Test successful! Entity extraction working', {
          description: `Detected ${response.payload.detected_entities.length} entities`
        });
      } else {
        toast.success('Content processed successfully', {
          description: response.message || 'Content added to monitoring pipeline'
        });
      }
      
      return response;
    } else {
      toast.error('Failed to process content', {
        description: 'The ARIA ingest pipeline returned an error'
      });
      return null;
    }
  } catch (error) {
    console.error('Error submitting to ARIA ingest:', error);
    toast.error('Submission failed', {
      description: error instanceof Error ? error.message : 'Unknown error occurred'
    });
    return null;
  }
};

/**
 * Test the ARIA ingest function with sample data
 */
export const testAriaIngest = async (): Promise<AriaIngestResponse | null> => {
  const testRequest: AriaIngestRequest = {
    content: "TechCorp CEO John Doe partners with Acme Inc. for new product launch",
    platform: "twitter",
    url: "https://example.com/test",
    test: true
  };
  
  return await submitToAriaIngest(testRequest);
};
