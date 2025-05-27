
import { MonitoringSource } from '../types';

export const getDefaultSources = (): MonitoringSource[] => [
  {
    id: 'uk-news',
    name: 'UK News Scanner',
    type: 'news',
    enabled: true,
    status: 'active',
    description: 'Scans major UK news outlets including BBC, Guardian, Telegraph, Sky News',
    lastScan: null
  },
  {
    id: 'reddit',
    name: 'Reddit UK Monitor',
    type: 'social',
    enabled: true,
    status: 'active',
    description: 'Monitors UK-focused subreddits for reputation threats',
    lastScan: null
  },
  {
    id: 'rss-news',
    name: 'RSS News Feeds',
    type: 'news',
    enabled: true,
    status: 'active',
    description: 'Real-time RSS feed monitoring for breaking news',
    lastScan: null
  },
  {
    id: 'aria-scraper',
    name: 'A.R.I.A Video Intelligence',
    type: 'social',
    enabled: true,
    status: 'active',
    description: 'Advanced video content analysis and monitoring',
    lastScan: null
  }
];
