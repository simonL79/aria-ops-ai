
// Simulate data ingestion and threat monitoring
import { getAvailableSources } from "@/services/dataIngestion";
import { classifyThreat } from "@/services/intelligence/threatClassifier";
import { ThreatClassifierRequest } from "@/types/intelligence";
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
  category?: string;
  severity?: number;
  recommendation?: string;
  ai_reasoning?: string;
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

// Save a new mention to our in-memory database with AI-based threat classification
export const saveMention = async (source: string, content: string, url: string) => {
  try {
    // Classify the content threat level using our AI service
    const request: ThreatClassifierRequest = {
      content,
      platform: source,
      brand: "ARIA" // Default brand name
    };
    
    const classification = await classifyThreat(request);
    
    mentionsDatabase.push({
      source,
      content,
      url,
      timestamp: new Date(),
      category: classification?.category,
      severity: classification?.severity,
      recommendation: classification?.recommendation,
      ai_reasoning: classification?.ai_reasoning
    });
    
    console.log(`New mention saved from ${source} with classification: ${classification?.category}`);
    return true;
  } catch (error) {
    console.error(`Error saving and classifying mention: ${error}`);
    // Still save the mention without classification
    mentionsDatabase.push({
      source,
      content,
      url,
      timestamp: new Date()
    });
    return false;
  }
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
    setTimeout(async () => {
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
      await monitorPlatforms();
      
      resolve();
    }, 2500);
  });
};

// Monitor all active platforms
const monitorPlatforms = async () => {
  const platforms = getMonitoredPlatforms();
  const keywords = ["ARIA", "Brand Protection", "Reputation Management"];
  
  for (const platform of platforms) {
    switch(platform) {
      case 'twitter':
        await monitorTwitter(keywords);
        break;
      case 'reddit':
        await monitorReddit(keywords);
        break;
      case 'google_news':
        await monitorGoogleNews(keywords);
        break;
      case 'discord':
        await monitorDiscord(keywords);
        break;
      case 'tiktok':
        await monitorTikTok(keywords);
        break;
      case 'telegram':
        await monitorTelegram(keywords);
        break;
      case 'whatsapp':
        await monitorWhatsapp(keywords);
        break;
      default:
        console.log(`Platform ${platform} not supported yet`);
    }
  }
};

// Twitter monitoring simulation
const monitorTwitter = async (keywords: string[]) => {
  console.log("Monitoring Twitter for keywords:", keywords);
  // Simulate finding mentions
  for (const keyword of keywords) {
    if (Math.random() > 0.6) {
      await saveMention(
        "Twitter", 
        `Just found ${keyword} mentioned in a discussion about brand monitoring tools. #RepManagement`, 
        "https://twitter.com/user/status/123456789"
      );
    }
  }
};

// Reddit monitoring simulation
const monitorReddit = async (keywords: string[]) => {
  console.log("Monitoring Reddit for keywords:", keywords);
  // Simulate finding mentions
  for (const keyword of keywords) {
    if (Math.random() > 0.7) {
      await saveMention(
        "Reddit", 
        `${keyword}: A discussion thread about the best reputation management tools in 2025`, 
        "https://reddit.com/r/marketing/comments/abc123"
      );
    }
  }
};

// Google News monitoring simulation
const monitorGoogleNews = async (keywords: string[]) => {
  console.log("Monitoring Google News for keywords:", keywords);
  // Simulate finding mentions
  for (const keyword of keywords) {
    if (Math.random() > 0.8) {
      await saveMention(
        "GoogleNews", 
        `${keyword} featured in new article about emerging AI tools for brand protection`, 
        "https://news.google.com/articles/123456"
      );
    }
  }
};

// Discord monitoring simulation
const monitorDiscord = async (keywords: string[]) => {
  console.log("Monitoring Discord for keywords:", keywords);
  // Simulate finding mentions
  for (const keyword of keywords) {
    if (Math.random() > 0.75) {
      await saveMention(
        "Discord", 
        `Users discussing ${keyword} in a marketing technology server`, 
        "https://discord.com/channels/123456789"
      );
    }
  }
};

// TikTok monitoring simulation
const monitorTikTok = async (keywords: string[]) => {
  console.log("Monitoring TikTok for keywords:", keywords);
  // Simulate finding mentions
  for (const keyword of keywords) {
    if (Math.random() > 0.65) {
      await saveMention(
        "TikTok", 
        `Viral video mentioning ${keyword} has 50K+ views`, 
        "https://tiktok.com/@user/video/123456789"
      );
    }
  }
};

// Telegram monitoring simulation
const monitorTelegram = async (keywords: string[]) => {
  console.log("Monitoring Telegram for keywords:", keywords);
  // Simulate finding mentions
  for (const keyword of keywords) {
    if (Math.random() > 0.85) {
      await saveMention(
        "Telegram", 
        `${keyword} mentioned in industry discussion group with 5K members`, 
        "https://t.me/channel/123456"
      );
    }
  }
};

// WhatsApp monitoring simulation
const monitorWhatsapp = async (keywords: string[]) => {
  console.log("Monitoring WhatsApp for keywords:", keywords);
  // Simulate finding mentions
  for (const keyword of keywords) {
    if (Math.random() > 0.9) {
      await saveMention(
        "WhatsApp", 
        `Business WhatsApp mention for ${keyword} from potential client`, 
        "https://wa.me/123456789"
      );
    }
  }
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
