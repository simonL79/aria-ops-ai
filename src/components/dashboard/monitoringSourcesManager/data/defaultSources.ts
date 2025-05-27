
import React from 'react';
import { 
  MessageSquare, 
  Camera, 
  Globe, 
  Trophy 
} from "lucide-react";
import { MonitoringSource } from '../types';

export const getDefaultSources = (): MonitoringSource[] => [
  {
    id: 'uk-news',
    name: 'UK News Scanner',
    type: 'news',
    platform: 'UK Media',
    enabled: true,
    status: 'active',
    icon: React.createElement(Globe, { className: "h-4 w-4" }),
    description: 'Scans major UK news outlets including BBC, Guardian, Telegraph, Sky News',
    lastScan: null
  },
  {
    id: 'reddit',
    name: 'Reddit UK Monitor',
    type: 'social',
    platform: 'Reddit',
    enabled: true,
    status: 'active',
    icon: React.createElement(MessageSquare, { className: "h-4 w-4" }),
    description: 'Monitors UK-focused subreddits for reputation threats',
    lastScan: null
  },
  {
    id: 'rss-news',
    name: 'RSS News Feeds',
    type: 'news',
    platform: 'RSS',
    enabled: true,
    status: 'active',
    icon: React.createElement(Globe, { className: "h-4 w-4" }),
    description: 'Real-time RSS feed monitoring for breaking news',
    lastScan: null
  },
  {
    id: 'aria-scraper',
    name: 'A.R.I.A Video Intelligence',
    type: 'social',
    platform: 'YouTube',
    enabled: true,
    status: 'active',
    icon: React.createElement(Trophy, { className: "h-4 w-4" }),
    description: 'Advanced video content analysis and monitoring',
    lastScan: null
  }
];
