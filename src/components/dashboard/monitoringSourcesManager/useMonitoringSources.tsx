
import { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Camera, 
  Globe, 
  Users, 
  Trophy, 
  Briefcase 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MonitoringSource, ScanResult } from './types';

export const useMonitoringSources = () => {
  const [sources, setSources] = useState<MonitoringSource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [scanResults, setScanResults] = useState<Record<string, ScanResult>>({});

  // Initialize default sources focused on UK public figures
  useEffect(() => {
    const defaultSources: MonitoringSource[] = [
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
        id: 'social-media-scraper',
        name: 'Social Media Bundle',
        type: 'social',
        platform: 'YouTube, Instagram, TikTok',
        enabled: true,
        status: 'active',
        icon: <Users className="h-4 w-4" />,
        description: 'Automated scraping of YouTube, Instagram, and TikTok for UK celebrity and sports content threats'
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
        description: 'Monitor Instagram posts and stories for UK public figure content',
        requiresSetup: true
      },
      {
        id: 'tiktok-monitoring',
        name: 'TikTok Monitoring',
        type: 'social',
        platform: 'TikTok',
        enabled: false,
        status: 'inactive',
        icon: <Users className="h-4 w-4" />,
        description: 'Track viral TikTok content involving UK celebrities and sports personalities',
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
    setSources(defaultSources);
  }, []);

  const triggerScan = async (sourceId: string) => {
    setIsLoading(true);
    try {
      let functionName = '';
      
      switch (sourceId) {
        case 'reddit':
          functionName = 'reddit-scan';
          break;
        case 'rss-news':
          functionName = 'rss-scraper';
          break;
        case 'social-media-scraper':
          functionName = 'social-media-scraper';
          break;
        default:
          toast.error('Scanner not yet implemented for this source');
          return;
      }

      const { data, error } = await supabase.functions.invoke(functionName);
      
      if (error) {
        throw new Error(error.message);
      }
      
      setScanResults(prev => ({
        ...prev,
        [sourceId]: data
      }));
      
      // Update last scan time
      setSources(prev => prev.map(source => 
        source.id === sourceId 
          ? { ...source, lastScan: new Date().toLocaleString(), status: 'active' as const }
          : source
      ));
      
      const sourceName = sources.find(s => s.id === sourceId)?.name;
      let contentType = 'potential threats';
      
      if (sourceId === 'rss-news') {
        contentType = 'celebrity/sports threats';
      } else if (sourceId === 'social-media-scraper') {
        contentType = 'social media threats';
      }
      
      toast.success(`${sourceName} scan completed`, {
        description: `Found ${data.results?.total || data.matches_found || 0} ${contentType}`
      });
    } catch (error) {
      console.error('Error triggering scan:', error);
      toast.error('Scan failed', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
      
      // Update status to error
      setSources(prev => prev.map(source => 
        source.id === sourceId 
          ? { ...source, status: 'error' as const }
          : source
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSource = (sourceId: string, enabled: boolean) => {
    setSources(prev => prev.map(source => 
      source.id === sourceId 
        ? { ...source, enabled }
        : source
    ));
    
    const sourceName = sources.find(s => s.id === sourceId)?.name;
    toast.success(`${sourceName} ${enabled ? 'enabled' : 'disabled'}`);
  };

  const addSource = (newSource: MonitoringSource) => {
    setSources(prev => [...prev, newSource]);
  };

  const filterByType = (type: string) => {
    return sources.filter(source => type === 'all' || source.type === type);
  };

  return {
    sources,
    isLoading,
    scanResults,
    triggerScan,
    toggleSource,
    addSource,
    filterByType
  };
};
