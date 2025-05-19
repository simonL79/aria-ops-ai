
import { toast } from "sonner";
import { ThreatSource } from "@/types/intelligence";
import { ContentAlert } from "@/types/dashboard";

// Sample sources for the MVP
const availableSources: ThreatSource[] = [
  {
    id: 'twitter',
    name: 'Twitter/X',
    type: 'social',
    platform: 'Twitter',
    active: true,
    lastScan: '10 minutes ago',
    credentials: {
      type: 'api',
      status: 'valid'
    }
  },
  {
    id: 'reddit',
    name: 'Reddit',
    type: 'social',
    platform: 'Reddit',
    active: true,
    lastScan: '15 minutes ago',
    credentials: {
      type: 'api',
      status: 'valid'
    }
  },
  {
    id: 'google_news',
    name: 'Google News',
    type: 'news',
    platform: 'Google',
    active: true,
    lastScan: '30 minutes ago',
    credentials: {
      type: 'api',
      status: 'valid'
    }
  },
  {
    id: 'discord',
    name: 'Discord',
    type: 'social',
    platform: 'Discord',
    active: false,
    credentials: {
      type: 'bot',
      status: 'invalid'
    }
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    type: 'social',
    platform: 'TikTok',
    active: false,
    credentials: {
      type: 'api',
      status: 'invalid'
    }
  },
  {
    id: 'telegram',
    name: 'Telegram',
    type: 'social',
    platform: 'Telegram',
    active: false,
    credentials: {
      type: 'bot',
      status: 'invalid'
    }
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    type: 'messaging',
    platform: 'WhatsApp',
    active: false,
    credentials: {
      type: 'business',
      status: 'invalid'
    }
  },
  {
    id: 'yelp',
    name: 'Yelp',
    type: 'review',
    platform: 'Yelp',
    active: false,
    credentials: {
      type: 'oauth',
      status: 'expired'
    }
  },
  {
    id: 'dark_forums',
    name: 'Dark Web Forums',
    type: 'dark',
    platform: 'Various',
    active: false,
    credentials: {
      type: 'credentials',
      status: 'invalid'
    }
  }
];

type IngestionOptions = {
  keywords: string[];
  sources: string[];
  startDate?: Date;
  endDate?: Date;
  maxResults?: number;
}

const defaultOptions: IngestionOptions = {
  keywords: ['company name', 'brand name'],
  sources: ['twitter', 'reddit', 'google_news'],
  maxResults: 100
};

/**
 * Fetches content from configured sources based on keywords
 */
export const fetchContent = async (options: Partial<IngestionOptions> = {}): Promise<ContentAlert[]> => {
  const mergedOptions = { ...defaultOptions, ...options };
  
  try {
    // This would be an actual API call in production
    // For MVP, we'll simulate the fetch with some latency
    
    const simulatedData: ContentAlert[] = [];
    
    // Simulate different content from each source
    for (const sourceId of mergedOptions.sources) {
      const source = availableSources.find(s => s.id === sourceId);
      if (!source || !source.active) continue;
      
      // Generate 1-3 simulated results per source
      const resultCount = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < resultCount; i++) {
        simulatedData.push(generateSimulatedAlert(source.platform));
      }
    }
    
    return simulatedData;
    
  } catch (error) {
    console.error("Error fetching content:", error);
    toast.error("Failed to collect intelligence data");
    return [];
  }
};

/**
 * Connects to a new data source
 */
export const connectDataSource = async (sourceId: string, credentials: any): Promise<boolean> => {
  try {
    // Simulate API call to connect to the source
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update the source in our list
    const sourceIndex = availableSources.findIndex(s => s.id === sourceId);
    if (sourceIndex >= 0) {
      availableSources[sourceIndex].active = true;
      availableSources[sourceIndex].credentials = {
        type: credentials.type,
        status: 'valid'
      };
    }
    
    return true;
  } catch (error) {
    console.error("Failed to connect data source:", error);
    return false;
  }
};

/**
 * Returns all available data sources
 */
export const getAvailableSources = (): ThreatSource[] => {
  return availableSources;
};

/**
 * Generate a simulated alert for demo purposes
 */
const generateSimulatedAlert = (platform: string): ContentAlert => {
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
    status: 'new'
  };
};
