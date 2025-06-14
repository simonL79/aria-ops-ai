
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface DiscoveredThreat {
  id: string;
  entityName: string;
  entityType: string;
  threatLevel: number;
  spreadVelocity: number;
  mentionCount: number;
  sentiment: number;
  platform: string;
  contextSnippet: string;
  sourceUrl?: string;
  timestamp: string;
  clientLinked?: boolean;
  linkedClientName?: string;
  matchType?: string;
  matchConfidence?: number;
}

export interface ScanStats {
  platformsScanned: number;
  threatsFound: number;
  clientLinkedThreats: number;
}

export const useDiscoveryScanning = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [discoveredThreats, setDiscoveredThreats] = useState<DiscoveredThreat[]>([]);
  const [scanStats, setScanStats] = useState<ScanStats>({
    platformsScanned: 0,
    threatsFound: 0,
    clientLinkedThreats: 0
  });

  const startDiscoveryScan = useCallback(async () => {
    setIsScanning(true);
    setScanProgress(0);
    
    try {
      toast.info('Starting live zero-input discovery scan...');
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setScanProgress(prev => Math.min(prev + 15, 85));
      }, 1000);

      // Call live discovery scanner
      const { data, error } = await supabase.functions.invoke('discovery-scanner', {
        body: { scanType: 'live_intelligence' }
      });

      clearInterval(progressInterval);
      setScanProgress(100);

      if (error) {
        throw error;
      }

      if (data?.success) {
        const threats = data.threats.map((threat: any) => ({
          ...threat,
          id: `threat-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
        }));
        
        setDiscoveredThreats(threats);
        setScanStats(data.stats);
        
        if (threats.length > 0) {
          toast.success(`Live discovery scan completed: ${data.stats.threatsFound} real threats found`);
        } else {
          toast.success('Discovery scan completed: No active threats detected');
        }
      } else {
        throw new Error('Scan failed');
      }
    } catch (error) {
      console.error('Discovery scan error:', error);
      toast.error('Discovery scan failed. Please try again.');
    } finally {
      setIsScanning(false);
      setScanProgress(0);
    }
  }, []);

  const stopDiscoveryScan = useCallback(() => {
    setIsScanning(false);
    setScanProgress(0);
    toast.info('Discovery scan stopped');
  }, []);

  return {
    isScanning,
    scanProgress,
    discoveredThreats,
    scanStats,
    startDiscoveryScan,
    stopDiscoveryScan,
  };
};
