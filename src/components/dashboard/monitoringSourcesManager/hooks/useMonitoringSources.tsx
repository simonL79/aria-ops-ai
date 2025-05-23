
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
      
      switch (sourceId) {
        case 'reddit':
          functionName = 'reddit-scan';
          break;
        case 'rss-news':
          functionName = 'rss-scraper';
          break;
        case 'aria-scraper':
          functionName = 'aria-scraper';
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
      } else if (sourceId === 'aria-scraper') {
        contentType = 'YouTube threats';
      }
      
      toast.success(`${sourceName} scan completed`, {
        description: `Found ${data.results?.total || data.total || data.matches_found || 0} ${contentType}`
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
