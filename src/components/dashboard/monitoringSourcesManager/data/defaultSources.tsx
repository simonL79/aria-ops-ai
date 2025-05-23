
import React from 'react';
import { 
  MessageSquare, 
  Camera, 
  Globe, 
  Trophy, 
  Briefcase 
} from "lucide-react";
import { MonitoringSource } from '../types';

export const getDefaultSources = (): MonitoringSource[] => [
  {
    id: 'reddit',
    name: 'Reddit Scanner',
    type: 'social',
    platform: 'Reddit',
    enabled: true,
    status: 'active',
    icon: <MessageSquare className="h-4 w-4" />,
    description: 'Monitors UK-focused subreddits for reputation threats about public figures',
    lastScan: 'Active (hourly scans)'
  },
  {
    id: 'rss-news',
    name: 'UK Celebrity & Sports News',
    type: 'news',
    platform: 'UK Media',
    enabled: true,
    status: 'active',
    icon: <Camera className="h-4 w-4" />,
    description: 'Monitors BBC, The Sun, Daily Mail, Guardian, Sky Sports and other UK outlets for celebrity and sports threats'
  },
  {
    id: 'aria-scraper',
    name: 'YouTube RSS Scanner',
    type: 'social',
    platform: 'YouTube',
    enabled: true,
    status: 'active',
    icon: <Trophy className="h-4 w-4" />,
    description: 'Daily scan of YouTube RSS feeds for UK celebrity and sports channel content threats',
    lastScan: 'Daily at 8 AM UTC'
  },
  {
    id: 'twitter',
    name: 'Twitter/X Monitor',
    type: 'social',
    platform: 'X (Twitter)',
    enabled: false,
    status: 'inactive',
    icon: <Globe className="h-4 w-4" />,
    description: 'Real-time Twitter monitoring for UK celebrity mentions and trending topics',
    requiresSetup: true
  },
  {
    id: 'instagram-monitoring',
    name: 'Instagram Monitoring',
    type: 'social',
    platform: 'Instagram',
    enabled: false,
    status: 'inactive',
    icon: <Camera className="h-4 w-4" />,
    description: 'Monitor Instagram posts and stories for UK public figure content (External scraper required)',
    requiresSetup: true
  },
  {
    id: 'tiktok-monitoring',
    name: 'TikTok Monitoring',
    type: 'social',
    platform: 'TikTok',
    enabled: false,
    status: 'inactive',
    icon: <Camera className="h-4 w-4" />,
    description: 'Track viral TikTok content involving UK celebrities and sports personalities (External scraper required)',
    requiresSetup: true
  },
  {
    id: 'youtube-monitoring',
    name: 'YouTube Monitoring',
    type: 'social',
    platform: 'YouTube',
    enabled: false,
    status: 'inactive',
    icon: <Trophy className="h-4 w-4" />,
    description: 'Monitor UK YouTube channels and comments for celebrity/sports content',
    requiresSetup: true
  },
  {
    id: 'linkedin',
    name: 'LinkedIn Monitoring',
    type: 'social',
    platform: 'LinkedIn',
    enabled: false,
    status: 'inactive',
    icon: <Briefcase className="h-4 w-4" />,
    description: 'Monitor UK business figures and professional athlete activities',
    requiresSetup: true
  }
];
