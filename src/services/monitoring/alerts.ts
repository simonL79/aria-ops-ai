
import { Mention } from "./types";
import { ContentAlert } from "@/types/dashboard";
import { getAllMentions } from "./mentions";

/**
 * Convert mentions to content alerts format
 */
export const getMentionsAsAlerts = (): ContentAlert[] => {
  const mentions = getAllMentions();
  
  return mentions.map(mention => ({
    id: mention.id,
    platform: mention.platform,
    content: mention.content,
    date: mention.date.toISOString().split('T')[0],
    severity: mention.severity,
    status: 'new',
    url: mention.source,
    threatType: mention.platform.includes('Twitter') ? 'Social Media Mention' : 'Web Mention'
  }));
};
