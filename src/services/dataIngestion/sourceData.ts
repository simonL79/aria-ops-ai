
import { ThreatSource } from "./types";

// Sample sources for the MVP
export const availableSources: ThreatSource[] = [
  {
    id: 'twitter',
    name: 'X',
    type: 'social',
    platform: 'X',
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
