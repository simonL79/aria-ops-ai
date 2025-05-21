
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
  // Using the correct number of arguments for saveMention
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
    ai_reasoning: mentionRequest.ai_reasoning,
    url: mentionRequest.sourceType === 'manual' ? '' : 'https://example.com'
  };
  
  return newAlert;
};
