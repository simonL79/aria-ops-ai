
import { ContentAlert } from "@/types/dashboard";
import { getAllMentions } from "./mentions";

/**
 * Convert mentions to content alerts for the dashboard
 */
export const getMentionsAsAlerts = (): ContentAlert[] => {
  return getAllMentions().map((mention, index) => {
    // Map severity number to our low/medium/high classification
    let severityText: 'low' | 'medium' | 'high' = 'low';
    
    if (mention.severity) {
      if (mention.severity >= 8) {
        severityText = 'high';
      } else if (mention.severity >= 4) {
        severityText = 'medium';
      }
    } else {
      // Fallback if no AI classification
      severityText = mention.content.includes('viral') || mention.content.includes('50K') 
        ? 'high' 
        : mention.content.includes('discussion') 
          ? 'medium' 
          : 'low';
    }
        
    return {
      id: `mention-${index}-${Date.now()}`,
      platform: mention.source,
      content: mention.content,
      date: mention.timestamp.toLocaleTimeString(),
      severity: severityText,
      status: 'new',
      sourceType: getPlatformType(mention.source),
      confidenceScore: Math.floor(Math.random() * 100),
      sentiment: getSentimentFromContent(mention.content),
      category: mention.category,
      recommendation: mention.recommendation,
      ai_reasoning: mention.ai_reasoning
    };
  });
};

// Helper function to determine platform type
const getPlatformType = (platform: string): string => {
  switch(platform) {
    case 'Twitter':
    case 'Reddit':
    case 'Discord':
    case 'TikTok':
      return 'social';
    case 'GoogleNews':
      return 'news';
    case 'Telegram':
    case 'WhatsApp':
      return 'messaging';
    default:
      return 'other';
  }
};

// Helper function to simulate sentiment analysis
const getSentimentFromContent = (content: string): 'positive' | 'neutral' | 'negative' => {
  const positiveWords = ['best', 'great', 'excellent', 'featured', 'viral'];
  const negativeWords = ['terrible', 'worst', 'bad', 'issue', 'problem'];
  
  const contentLower = content.toLowerCase();
  
  for (const word of positiveWords) {
    if (contentLower.includes(word)) return 'positive';
  }
  
  for (const word of negativeWords) {
    if (contentLower.includes(word)) return 'negative';
  }
  
  return 'neutral';
};
