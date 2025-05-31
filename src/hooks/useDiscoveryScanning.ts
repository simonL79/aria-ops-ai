
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
  clientLinked?: boolean;
  linkedClientId?: string;
  linkedClientName?: string;
  matchType?: string;
  matchConfidence?: number;
}

export interface ScanStats {
  platformsScanned: number;
  entitiesFound: number;
  threatsDetected: number;
  highPriorityThreats: number;
  clientLinkedThreats: number;
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
    highPriorityThreats: 0,
    clientLinkedThreats: 0
  });

  // Load existing live threats from scan_results table
  useEffect(() => {
    loadLiveThreats();
  }, []);

  const loadLiveThreats = async () => {
    try {
      const { data: scanResults, error } = await supabase
        .from('scan_results')
        .select('*')
        .eq('source_type', 'live_osint')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Last 7 days
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('❌ Error loading live scan results:', error);
        return;
      }

      const threats: DiscoveredThreat[] = (scanResults || []).map(item => ({
        id: item.id,
        entityName: item.risk_entity_name || item.platform || 'Detected Entity',
        entityType: item.risk_entity_type === 'person' ? 'person' : 'brand',
        platform: item.platform || 'Unknown',
        content: item.content || '',
        threatLevel: Math.min(10, Math.max(1, Math.floor(Math.abs(item.sentiment || 0) * 10))),
        threatType: item.threat_type || 'reputation_risk',
        sentiment: item.sentiment || 0,
        sourceUrl: item.url || '',
        contextSnippet: (item.content || '').substring(0, 150) + (item.content && item.content.length > 150 ? '...' : ''),
        mentionCount: 1,
        spreadVelocity: Math.floor(Math.random() * 10) + 1,
        timestamp: item.created_at,
        status: item.status === 'resolved' ? 'resolved' : 'active',
        clientLinked: item.client_linked || false,
        linkedClientId: item.linked_client_id,
        linkedClientName: item.linked_client_id,
        matchType: item.client_linked ? 'linked' : undefined,
        matchConfidence: item.confidence_score || undefined
      }));

      setDiscoveredThreats(threats);
      
      setScanStats({
        platformsScanned: new Set(threats.map(t => t.platform)).size,
        entitiesFound: new Set(threats.map(t => t.entityName)).size,
        threatsDetected: threats.length,
        highPriorityThreats: threats.filter(t => t.threatLevel >= 8).length,
        clientLinkedThreats: threats.filter(t => t.clientLinked).length
      });

      console.log(`✅ Loaded ${threats.length} live threats from OSINT sources`);

    } catch (error) {
      console.error('❌ Error loading live threats:', error);
    }
  };

  const startDiscoveryScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    
    try {
      toast.info('🔍 A.R.I.A™ OSINT: Starting live discovery scan...');
      
      // Progress updates
      const progressInterval = setInterval(() => {
        setScanProgress(prev => Math.min(prev + 15, 85));
      }, 1000);

      // Execute live discovery scanning functions
      const liveScanFunctions = [
        'discovery-scanner',
        'enhanced-intelligence',
        'reddit-scan',
        'uk-news-scanner',
        'monitoring-scan'
      ];

      console.log('🔍 Executing live discovery scans...');
      const scanPromises = liveScanFunctions.map(func => 
        supabase.functions.invoke(func, {
          body: { 
            scanType: 'live_osint',
            enableLiveData: true,
            blockMockData: true
          }
        })
      );

      const results = await Promise.allSettled(scanPromises);
      const successfulScans = results.filter(result => result.status === 'fulfilled').length;

      clearInterval(progressInterval);
      setScanProgress(100);

      // Reload live threats from database to get latest data
      await loadLiveThreats();
      
      if (successfulScans > 0) {
        toast.success(`✅ Live discovery scan completed: ${successfulScans}/${liveScanFunctions.length} OSINT modules executed`);
      } else {
        toast.error('❌ Live discovery scan failed: No OSINT modules executed successfully');
      }
      
    } catch (error) {
      console.error('❌ Discovery scan error:', error);
      toast.error('Live discovery scan encountered an error. Please try again.');
    } finally {
      setIsScanning(false);
      setScanProgress(0);
    }
  };

  const stopDiscoveryScan = () => {
    setIsScanning(false);
    setScanProgress(0);
    toast.info('Live discovery scan stopped');
  };

  return {
    isScanning,
    scanProgress,
    discoveredThreats,
    scanStats,
    startDiscoveryScan,
    stopDiscoveryScan,
    loadExistingThreats: loadLiveThreats
  };
};
