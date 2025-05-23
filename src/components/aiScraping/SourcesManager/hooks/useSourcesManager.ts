
import { useState, useEffect } from 'react';
import { ScrapingSource } from '@/types/aiScraping';
import { getAllSources, updateSource, toggleSourceEnabled, deleteSource } from '@/services/aiScrapingService';
import { toast } from 'sonner';

export const useSourcesManager = () => {
  const [sources, setSources] = useState<ScrapingSource[]>([]);

  useEffect(() => {
    loadSources();
  }, []);

  const loadSources = () => {
    const loadedSources = getAllSources();
    setSources(loadedSources);
  };

  const handleToggleSource = (id: string, enabled: boolean) => {
    toggleSourceEnabled(id, enabled);
    loadSources();
    
    toast.success(`Source ${enabled ? 'enabled' : 'disabled'}`, {
      description: `Changes saved successfully`
    });
  };

  const handleDeleteSource = (id: string) => {
    deleteSource(id);
    loadSources();
    
    toast.success(`Source removed`, {
      description: `The source has been removed`
    });
  };

  const handleRefreshSource = (source: ScrapingSource) => {
    updateSource({
      ...source,
      lastScan: new Date().toISOString()
    });
    loadSources();
    
    toast.success(`Source refreshed`, {
      description: `"${source.name}" has been refreshed`
    });
  };

  return {
    sources,
    loadSources,
    handleToggleSource,
    handleDeleteSource,
    handleRefreshSource
  };
};
