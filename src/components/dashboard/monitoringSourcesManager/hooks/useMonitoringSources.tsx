
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MonitoringSource, ScanResult } from '../types';
import { getDefaultSources } from '../data/defaultSources';

export const useMonitoringSources = () => {
  const [sources, setSources] = useState<MonitoringSource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [scanResults, setScanResults] = useState<Record<string, ScanResult>>({});

  // Initialize default sources focused on UK public figures
  useEffect(() => {
    const defaultSources = getDefaultSources();
    setSources(defaultSources);
  }, []);

  const triggerScan = async (sourceId: string) => {
    setIsLoading(true);
    
    try {
      let functionName = '';
      let requestBody = {};
      
      switch (sourceId) {
        case 'reddit':
          functionName = 'reddit-scan';
          requestBody = { 
            subreddits: ['ukpolitics', 'unitedkingdom', 'soccer', 'ukpersonalfinance'],
            keywords: ['scandal', 'controversy', 'crisis']
          };
          break;
        case 'rss-news':
          functionName = 'rss-scraper';
          requestBody = { 
            sources: ['bbc', 'guardian', 'telegraph', 'sky'],
            categories: ['politics', 'business', 'sport', 'entertainment']
          };
          break;
        case 'uk-news':
          functionName = 'uk-news-scanner';
          requestBody = { 
            sources: ['BBC News', 'The Guardian', 'The Telegraph', 'Sky News'],
            scan_type: 'reputation_threats'
          };
          break;
        case 'aria-scraper':
          functionName = 'aria-scraper';
          requestBody = { 
            platform: 'youtube',
            search_terms: ['UK celebrity news', 'British politics scandal']
          };
          break;
        default:
          toast.error('Scanner not configured for this source');
          return;
      }

      console.log(`Triggering scan for ${sourceId} using function ${functionName}`);
      console.log('Request body:', requestBody);
      
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: requestBody
      });
      
      if (error) {
        console.error('Function invocation error:', error);
        throw new Error(error.message || 'Function call failed');
      }
      
      console.log('Scan result:', data);
      
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
      let resultsCount = 0;
      
      // Handle different response formats
      if (data?.results?.length) {
        resultsCount = data.results.length;
      } else if (data?.threats?.length) {
        resultsCount = data.threats.length;
      } else if (data?.matches_found) {
        resultsCount = data.matches_found;
      } else if (data?.processed_count) {
        resultsCount = data.processed_count;
      } else if (data?.articles_found) {
        resultsCount = data.articles_found;
        contentType = 'articles with entities';
      } else if (data?.total) {
        resultsCount = data.total;
      }
      
      if (sourceId === 'rss-news' || sourceId === 'uk-news') {
        contentType = 'UK news threats';
      } else if (sourceId === 'aria-scraper') {
        contentType = 'YouTube threats';
      } else if (sourceId === 'reddit') {
        contentType = 'Reddit threats';
      }
      
      toast.success(`${sourceName} scan completed`, {
        description: `Found ${resultsCount} ${contentType}`
      });
      
    } catch (error) {
      console.error('Error triggering scan:', error);
      
      let errorMessage = 'Unknown error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast.error('Scan failed', {
        description: errorMessage
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
