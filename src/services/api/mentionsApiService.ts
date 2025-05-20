
import { ContentAlert } from '@/types/dashboard';
import { classifyThreat } from '@/services/intelligence/threatClassifier';
import { ThreatClassificationResult } from '@/types/intelligence';
import { saveMention } from '@/services/monitoring';
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
 * Classify content using the threat classifier
 */
export const classifyContent = async (
  content: string,
  platform: string,
  brand: string
): Promise<ThreatClassificationResult | null> => {
  try {
    // Use the threat classifier to analyze the content
    const result = await classifyThreat({
      content,
      platform,
      brand
    });
    
    return result;
  } catch (error) {
    console.error('Error classifying content:', error);
    toast.error('Failed to classify content');
    return null;
  }
};

/**
 * Store a mention in the system
 */
export const storeMention = async (mentionRequest: MentionStoreRequest): Promise<ContentAlert> => {
  // Store the mention using the monitoring service
  saveMention(
    mentionRequest.platform,
    mentionRequest.content,
    mentionRequest.sourceType === 'manual' ? 'Manual Entry' : 'https://example.com'
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
    ai_reasoning: mentionRequest.ai_reasoning,
    url: mentionRequest.sourceType === 'manual' ? '' : 'https://example.com'
  };
  
  return newAlert;
};
