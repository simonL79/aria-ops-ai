
import { ContentAlert } from "@/types/dashboard";
import { getAllMentions } from "./mentions";

/**
 * Convert mentions to ContentAlert format for dashboard display
 */
export const getMentionsAsAlerts = (): ContentAlert[] => {
  const mentions = getAllMentions();
  
  return mentions.map(mention => ({
    id: mention.id,
    platform: mention.platform,
    content: mention.content,
    date: mention.date instanceof Date ? 
      mention.date.toLocaleDateString() : 
      new Date(mention.date).toLocaleDateString(),
    severity: mention.severity,
    status: 'new',
    url: mention.source,
    threatType: getRandomThreatType()
  }));
};

// Helper function to generate random threat types for demo purposes
const getRandomThreatType = (): string => {
  const threatTypes = [
    'falseReviews',
    'coordinatedAttack',
    'misinformation',
    'viralThreat',
    'competitorSmear',
    'dataBreach',
    'securityVulnerability'
  ];
  
  return threatTypes[Math.floor(Math.random() * threatTypes.length)];
};
