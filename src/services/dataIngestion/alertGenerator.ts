import { ContentAlert } from "@/types/dashboard";

/**
 * Generate a simulated alert for demo purposes
 */
export const generateSimulatedAlert = (platform: string): ContentAlert => {
  const severities = ['low', 'medium', 'high'];
  const severity = severities[Math.floor(Math.random() * severities.length)];
  
  const contentOptions = [
    "I had a terrible experience with this company. Will never use their services again!",
    "Just found out this company has been using unethical practices. Spread the word!",
    "Their customer support is non-existent. Stay away!",
    "Been using their product for a month and noticed some serious quality issues.",
    "This company completely misrepresented their service. Looking into legal options."
  ];
  
  const content = contentOptions[Math.floor(Math.random() * contentOptions.length)];
  
  return {
    id: `sim-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    platform,
    content,
    date: '10 minutes ago',
    severity: severity as 'low' | 'medium' | 'high',
    status: 'new',
    url: '',
    sourceType: 'simulation',
    confidenceScore: 75,
    sentiment: 'neutral',
    detectedEntities: []
  };
};

export const generateAlertFromContent = (
  content: string,
  platform: string,
  source: string
): ContentAlert => {
  const severity = analyzeSeverity(content);
  const threatType = identifyThreatType(content);
  
  return {
    id: `alert-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    platform,
    content,
    date: new Date().toISOString(),
    severity,
    status: 'new',
    url: source,
    threatType,
    sourceType: getSourceType(platform),
    confidenceScore: 75,
    sentiment: analyzeSentiment(content),
    detectedEntities: extractEntities(content),
    potentialReach: estimateReach(platform)
  };
};

const analyzeSeverity = (content: string): ContentAlert['severity'] => {
  const negativeWords = ['terrible', 'awful', 'hate', 'worst', 'scam'];
  const positiveWords = ['great', 'awesome', 'love', 'best', 'excellent'];
  
  const contentLower = content.toLowerCase();
  
  if (negativeWords.some(word => contentLower.includes(word))) return 'low';
  if (positiveWords.some(word => contentLower.includes(word))) return 'high';
  return 'medium';
};

const identifyThreatType = (content: string): ContentAlert['threatType'] => {
  const threateningWords = ['sue', 'legal', 'lawyer', 'court'];
  
  const contentLower = content.toLowerCase();
  
  if (threateningWords.some(word => contentLower.includes(word))) return 'threatening';
  return 'non-threatening';
};

const getSourceType = (platform: string): string => {
  const platformLower = platform.toLowerCase();
  if (platformLower.includes('news')) return 'news';
  if (platformLower.includes('reddit')) return 'forum';
  if (['twitter', 'facebook', 'instagram', 'linkedin'].includes(platformLower)) return 'social';
  return 'other';
};

const analyzeSentiment = (content: string): ContentAlert['sentiment'] => {
  const negativeWords = ['terrible', 'awful', 'hate', 'worst', 'scam'];
  const positiveWords = ['great', 'awesome', 'love', 'best', 'excellent'];
  const threateningWords = ['sue', 'legal', 'lawyer', 'court'];
  
  const contentLower = content.toLowerCase();
  
  if (threateningWords.some(word => contentLower.includes(word))) return 'threatening';
  if (negativeWords.some(word => contentLower.includes(word))) return 'negative';
  if (positiveWords.some(word => contentLower.includes(word))) return 'positive';
  return 'neutral';
};

const extractEntities = (content: string): string[] => {
  // Simple entity extraction - in a real implementation this would use NLP
  const entities = [];
  if (content.toLowerCase().includes('company')) entities.push('company');
  if (content.toLowerCase().includes('service')) entities.push('service');
  if (content.toLowerCase().includes('product')) entities.push('product');
  return entities;
};

const estimateReach = (platform: string): number => {
  const platformLower = platform.toLowerCase();
  if (platformLower.includes('twitter')) return Math.floor(Math.random() * 10000) + 1000;
  if (platformLower.includes('facebook')) return Math.floor(Math.random() * 5000) + 500;
  if (platformLower.includes('reddit')) return Math.floor(Math.random() * 2000) + 200;
  return Math.floor(Math.random() * 1000) + 100;
};
