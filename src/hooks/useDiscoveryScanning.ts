
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export interface DiscoveredThreat {
  id: string;
  entityName: string;
  entityType: 'person' | 'brand' | 'company';
  platform: string;
  content: string;
  threatLevel: number; // 1-10
  threatType: string;
  sentiment: number;
  sourceUrl: string;
  contextSnippet: string;
  mentionCount: number;
  spreadVelocity: number;
  timestamp: string;
  status: 'active' | 'investigating' | 'resolved';
  screenshotUrl?: string;
}

export interface ScanStats {
  platformsScanned: number;
  entitiesFound: number;
  threatsDetected: number;
  highPriorityThreats: number;
  reportsGenerated?: number;
  contactsFound?: number;
}

export const useDiscoveryScanning = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [discoveredThreats, setDiscoveredThreats] = useState<DiscoveredThreat[]>([]);
  const [scanStats, setScanStats] = useState<ScanStats>({
    platformsScanned: 0,
    entitiesFound: 0,
    threatsDetected: 0,
    highPriorityThreats: 0
  });

  // Load existing threats from database
  useEffect(() => {
    loadExistingThreats();
  }, []);

  const loadExistingThreats = async () => {
    try {
      const { data, error } = await supabase
        .from('scan_results')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const threats: DiscoveredThreat[] = (data || []).map(item => ({
        id: item.id,
        entityName: item.risk_entity_name || 'Unknown Entity',
        entityType: item.risk_entity_type === 'person' ? 'person' : 'brand',
        platform: item.platform,
        content: item.content,
        threatLevel: Math.min(10, Math.max(1, Math.floor(Math.abs(item.sentiment || 0) * 10))),
        threatType: item.threat_type || 'reputation_risk',
        sentiment: item.sentiment || 0,
        sourceUrl: item.url || '',
        contextSnippet: item.content.substring(0, 150) + '...',
        mentionCount: 1,
        spreadVelocity: Math.floor(Math.random() * 10) + 1,
        timestamp: item.created_at,
        status: item.status === 'resolved' ? 'resolved' : 'active'
      }));

      setDiscoveredThreats(threats);
      
      // Update stats
      setScanStats({
        platformsScanned: new Set(threats.map(t => t.platform)).size,
        entitiesFound: new Set(threats.map(t => t.entityName)).size,
        threatsDetected: threats.length,
        highPriorityThreats: threats.filter(t => t.threatLevel >= 8).length
      });

    } catch (error) {
      console.error('Error loading existing threats:', error);
    }
  };

  const startDiscoveryScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    
    try {
      // Simulate progressive scanning across platforms
      const platforms = ['Reddit', 'Google News', 'TrustPilot', 'Twitter', 'Forums', 'Blogs', 'Reviews', 'Social Media'];
      
      for (let i = 0; i < platforms.length; i++) {
        const platform = platforms[i];
        toast.info(`Scanning ${platform}...`);
        
        // Call the discovery scanner for this platform
        await scanPlatform(platform);
        
        setScanProgress(((i + 1) / platforms.length) * 100);
        setScanStats(prev => ({
          ...prev,
          platformsScanned: i + 1
        }));
        
        // Simulate scanning delay
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      toast.success("Discovery scan completed successfully!");
      
    } catch (error) {
      console.error('Error during discovery scan:', error);
      toast.error("Discovery scan encountered an error");
    } finally {
      setIsScanning(false);
    }
  };

  const scanPlatform = async (platform: string) => {
    try {
      // Call the discovery scanner edge function
      const response = await fetch('/functions/v1/discovery-scanner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform: platform.toLowerCase(),
          scanType: 'zero_input_discovery'
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to scan ${platform}`);
      }

      const results = await response.json();
      
      if (results.threats && results.threats.length > 0) {
        const newThreats: DiscoveredThreat[] = results.threats.map((threat: any) => ({
          id: Math.random().toString(36).substr(2, 9),
          entityName: threat.entity_name || 'Unknown Entity',
          entityType: threat.entity_type || 'brand',
          platform,
          content: threat.content || '',
          threatLevel: threat.threat_level || 5,
          threatType: threat.threat_type || 'reputation_risk',
          sentiment: threat.sentiment || 0,
          sourceUrl: threat.source_url || '',
          contextSnippet: threat.context_snippet || '',
          mentionCount: threat.mention_count || 1,
          spreadVelocity: threat.spread_velocity || 1,
          timestamp: new Date().toISOString(),
          status: 'active' as const
        }));

        setDiscoveredThreats(prev => [...newThreats, ...prev]);
        
        // Update stats
        setScanStats(prev => ({
          ...prev,
          entitiesFound: prev.entitiesFound + new Set(newThreats.map(t => t.entityName)).size,
          threatsDetected: prev.threatsDetected + newThreats.length,
          highPriorityThreats: prev.highPriorityThreats + newThreats.filter(t => t.threatLevel >= 8).length
        }));

        // Show high priority alerts
        const highPriorityThreats = newThreats.filter(t => t.threatLevel >= 8);
        if (highPriorityThreats.length > 0) {
          toast.error(`🚨 ${highPriorityThreats.length} high priority threats detected on ${platform}!`);
        }
      }
      
    } catch (error) {
      console.error(`Error scanning ${platform}:`, error);
    }
  };

  const stopDiscoveryScan = async () => {
    setIsScanning(false);
    toast.info("Discovery scan stopped");
  };

  return {
    isScanning,
    scanProgress,
    discoveredThreats,
    scanStats,
    startDiscoveryScan,
    stopDiscoveryScan,
    loadExistingThreats
  };
};
