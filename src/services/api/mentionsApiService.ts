import { ContentAlert } from '@/types/dashboard';
import { saveMention } from '@/services/monitoring/mentions';
import { toast } from 'sonner';

// Interface for storing mentions
interface MentionStoreRequest {
  platform: string;
  content: string;
  date: string;
  severity: 'low' | 'medium' | 'high';
  category?: string;
  recommendation?: string;
  ai_reasoning?: string;
  sourceType: string;
}

/**
 * Store a mention in the system
 */
export const storeMention = async (mentionRequest: MentionStoreRequest): Promise<ContentAlert> => {
  // Store the mention using the monitoring service
  saveMention(
    mentionRequest.platform,
    mentionRequest.content,
    mentionRequest.sourceType === 'manual' ? 'Manual Entry' : 'https://example.com',
    mentionRequest.severity,
    mentionRequest.category
  );
  
  // Create a ContentAlert from the request
  const newAlert: ContentAlert = {
    id: `mention-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    platform: mentionRequest.platform,
    content: mentionRequest.content,
    date: mentionRequest.date,
    severity: mentionRequest.severity,
    status: 'new',
    sourceType: mentionRequest.sourceType,
    category: mentionRequest.category,
    recommendation: mentionRequest.recommendation,
    url: mentionRequest.sourceType === 'manual' ? '' : 'https://example.com',
    confidenceScore: 75,
    sentiment: 'neutral',
    detectedEntities: []
  };
  
  return newAlert;
};

export const saveMentionAnalysis = async (
  mentionId: string,
  analysis: {
    threatLevel: string;
    category: string;
    recommendedAction: string;
    confidence: number;
  }
): Promise<boolean> => {
  try {
    const newAlert: ContentAlert = {
      id: mentionId,
      platform: 'Analysis',
      content: `Threat Level: ${analysis.threatLevel}, Category: ${analysis.category}`,
      date: new Date().toISOString(),
      severity: analysis.threatLevel as 'high' | 'medium' | 'low',
      status: 'new',
      url: '',
      sourceType: 'analysis',
      confidenceScore: analysis.confidence,
      sentiment: 'neutral',
      detectedEntities: [analysis.category],
      threatType: analysis.category,
      recommendation: analysis.recommendedAction
    };

    // Here you would typically save to your backend
    console.log('Saving mention analysis:', newAlert);
    
    return true;
  } catch (error) {
    console.error('Error saving mention analysis:', error);
    return false;
  }
};
