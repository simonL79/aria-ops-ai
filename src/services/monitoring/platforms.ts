
import { getAvailableSources } from "@/services/dataIngestion";
import { saveMention } from "./mentions";
import { MonitorablePlatform } from "./types";

/**
 * Get platforms that we're currently monitoring
 */
export const getMonitoredPlatforms = (): MonitorablePlatform[] => {
  const activeSources = getAvailableSources().filter(s => s.active);
  return activeSources.map(s => s.id as MonitorablePlatform);
};

/**
 * Check if a specific platform is being monitored
 */
export const isPlatformMonitored = (platform: MonitorablePlatform): boolean => {
  return getMonitoredPlatforms().includes(platform);
};

/**
 * Monitor all active platforms
 */
export const monitorPlatforms = async () => {
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
