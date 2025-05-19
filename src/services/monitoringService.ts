
// Simulate data ingestion and threat monitoring
import { getAvailableSources } from "@/services/dataIngestionService";

// Add import for risk profile utilities
import { quickRiskAssessment } from "@/utils/riskProfileUtils";
import { ContentAlert } from "@/types/dashboard";

// Define monitoring status type
interface MonitoringStatus {
  isActive: boolean;
  lastRun: Date;
  nextRun: Date;
  sources: number;
}

// Define platforms we can monitor
export type MonitorablePlatform = 
  'twitter' | 
  'reddit' | 
  'google_news' | 
  'discord' | 
  'tiktok' | 
  'telegram' | 
  'whatsapp';

// Mock monitoring status
let monitoringStatus: MonitoringStatus = {
  isActive: false,
  lastRun: new Date(),
  nextRun: new Date(),
  sources: getAvailableSources().filter(s => s.active).length
};

// Mock database for storing mentions (simulating the SQLite DB from Python)
let mentionsDatabase: Array<{
  source: string;
  content: string;
  url: string;
  timestamp: Date;
}> = [];

export const getMonitoringStatus = (): MonitoringStatus => {
  return monitoringStatus;
};

export const startMonitoring = () => {
  // Simulate starting the monitoring process
  monitoringStatus = {
    isActive: true,
    lastRun: new Date(),
    nextRun: new Date(),
    sources: getAvailableSources().filter(s => s.active).length
  };
  
  // Set next run time
  monitoringStatus.nextRun.setHours(monitoringStatus.lastRun.getHours() + 1);
};

export const stopMonitoring = () => {
  // Simulate stopping the monitoring process
  monitoringStatus.isActive = false;
};

// Save a new mention to our in-memory database
export const saveMention = (source: string, content: string, url: string) => {
  mentionsDatabase.push({
    source,
    content,
    url,
    timestamp: new Date()
  });
  
  console.log(`New mention saved from ${source}`);
  return true;
};

// Get all stored mentions
export const getAllMentions = () => {
  return mentionsDatabase;
};

// Clear mentions database (for testing)
export const clearMentions = () => {
  mentionsDatabase = [];
  return true;
};

export const runMonitoringScan = async () => {
  // Simulate an API call to scan for new threats
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      const lastRun = new Date();
      const nextRun = new Date();
      nextRun.setHours(lastRun.getHours() + 1);
      
      // Update monitoring status
      monitoringStatus = {
        isActive: true,
        lastRun,
        nextRun,
        sources: getAvailableSources().filter(s => s.active).length
      };
      
      // Simulate monitoring each platform
      monitorPlatforms();
      
      resolve();
    }, 2500);
  });
};

// Monitor all active platforms
const monitorPlatforms = () => {
  const platforms = getMonitoredPlatforms();
  const keywords = ["ARIA", "Brand Protection", "Reputation Management"];
  
  platforms.forEach(platform => {
    switch(platform) {
      case 'twitter':
        monitorTwitter(keywords);
        break;
      case 'reddit':
        monitorReddit(keywords);
        break;
      case 'google_news':
        monitorGoogleNews(keywords);
        break;
      case 'discord':
        monitorDiscord(keywords);
        break;
      case 'tiktok':
        monitorTikTok(keywords);
        break;
      case 'telegram':
        monitorTelegram(keywords);
        break;
      case 'whatsapp':
        monitorWhatsapp(keywords);
        break;
      default:
        console.log(`Platform ${platform} not supported yet`);
    }
  });
};

// Twitter monitoring simulation
const monitorTwitter = (keywords: string[]) => {
  console.log("Monitoring Twitter for keywords:", keywords);
  // Simulate finding mentions
  keywords.forEach(keyword => {
    if (Math.random() > 0.6) {
      saveMention(
        "Twitter", 
        `Just found ${keyword} mentioned in a discussion about brand monitoring tools. #RepManagement`, 
        "https://twitter.com/user/status/123456789"
      );
    }
  });
};

// Reddit monitoring simulation
const monitorReddit = (keywords: string[]) => {
  console.log("Monitoring Reddit for keywords:", keywords);
  // Simulate finding mentions
  keywords.forEach(keyword => {
    if (Math.random() > 0.7) {
      saveMention(
        "Reddit", 
        `${keyword}: A discussion thread about the best reputation management tools in 2025`, 
        "https://reddit.com/r/marketing/comments/abc123"
      );
    }
  });
};

// Google News monitoring simulation
const monitorGoogleNews = (keywords: string[]) => {
  console.log("Monitoring Google News for keywords:", keywords);
  // Simulate finding mentions
  keywords.forEach(keyword => {
    if (Math.random() > 0.8) {
      saveMention(
        "GoogleNews", 
        `${keyword} featured in new article about emerging AI tools for brand protection`, 
        "https://news.google.com/articles/123456"
      );
    }
  });
};

// Discord monitoring simulation
const monitorDiscord = (keywords: string[]) => {
  console.log("Monitoring Discord for keywords:", keywords);
  // Simulate finding mentions
  keywords.forEach(keyword => {
    if (Math.random() > 0.75) {
      saveMention(
        "Discord", 
        `Users discussing ${keyword} in a marketing technology server`, 
        "https://discord.com/channels/123456789"
      );
    }
  });
};

// TikTok monitoring simulation
const monitorTikTok = (keywords: string[]) => {
  console.log("Monitoring TikTok for keywords:", keywords);
  // Simulate finding mentions
  keywords.forEach(keyword => {
    if (Math.random() > 0.65) {
      saveMention(
        "TikTok", 
        `Viral video mentioning ${keyword} has 50K+ views`, 
        "https://tiktok.com/@user/video/123456789"
      );
    }
  });
};

// Telegram monitoring simulation
const monitorTelegram = (keywords: string[]) => {
  console.log("Monitoring Telegram for keywords:", keywords);
  // Simulate finding mentions
  keywords.forEach(keyword => {
    if (Math.random() > 0.85) {
      saveMention(
        "Telegram", 
        `${keyword} mentioned in industry discussion group with 5K members`, 
        "https://t.me/channel/123456"
      );
    }
  });
};

// WhatsApp monitoring simulation
const monitorWhatsapp = (keywords: string[]) => {
  console.log("Monitoring WhatsApp for keywords:", keywords);
  // Simulate finding mentions
  keywords.forEach(keyword => {
    if (Math.random() > 0.9) {
      saveMention(
        "WhatsApp", 
        `Business WhatsApp mention for ${keyword} from potential client`, 
        "https://wa.me/123456789"
      );
    }
  });
};

// Get platforms that we're currently monitoring
export const getMonitoredPlatforms = (): MonitorablePlatform[] => {
  const activeSources = getAvailableSources().filter(s => s.active);
  return activeSources.map(s => s.id as MonitorablePlatform);
};

// Check if a specific platform is being monitored
export const isPlatformMonitored = (platform: MonitorablePlatform): boolean => {
  return getMonitoredPlatforms().includes(platform);
};

// Convert mentions to content alerts for the dashboard
export const getMentionsAsAlerts = (): ContentAlert[] => {
  return mentionsDatabase.map((mention, index) => {
    const severity = mention.content.includes('viral') || mention.content.includes('50K') 
      ? 'high' 
      : mention.content.includes('discussion') 
        ? 'medium' 
        : 'low';
        
    return {
      id: `mention-${index}-${Date.now()}`,
      platform: mention.source,
      content: mention.content,
      date: mention.timestamp.toLocaleTimeString(),
      severity: severity as 'low' | 'medium' | 'high',
      status: 'new',
      sourceType: getPlatformType(mention.source),
      confidenceScore: Math.floor(Math.random() * 100),
      sentiment: getSentimentFromContent(mention.content)
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
