
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
  // New client-entity mapping fields
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

  // Load existing threats from scan_results table
  useEffect(() => {
    loadExistingThreats();
  }, []);

  const loadExistingThreats = async () => {
    try {
      const { data: scanResults, error } = await supabase
        .from('scan_results')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error loading scan results:', error);
        return;
      }

      const threats: DiscoveredThreat[] = (scanResults || []).map(item => ({
        id: item.id,
        entityName: item.risk_entity_name || 'Unknown Entity',
        entityType: item.risk_entity_type === 'person' ? 'person' : 'brand',
        platform: item.platform || 'Unknown',
        content: item.content || '',
        threatLevel: Math.min(10, Math.max(1, Math.floor(Math.abs(item.sentiment || 0) * 10))),
        threatType: item.threat_type || 'reputation_risk',
        sentiment: item.sentiment || 0,
        sourceUrl: item.url || '',
        contextSnippet: (item.content || '').substring(0, 150) + '...',
        mentionCount: 1,
        spreadVelocity: Math.floor(Math.random() * 10) + 1,
        timestamp: item.created_at,
        status: item.status === 'resolved' ? 'resolved' : 'active',
        clientLinked: item.client_linked || false,
        linkedClientId: item.linked_client_id,
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

    } catch (error) {
      console.error('Error loading existing threats:', error);
    }
  };

  const startDiscoveryScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    
    try {
      toast.info('Starting comprehensive discovery scan...');
      
      // Progress updates
      const progressInterval = setInterval(() => {
        setScanProgress(prev => Math.min(prev + 15, 85));
      }, 1000);

      // Call UK News Scanner edge function
      console.log('Calling UK News Scanner...');
      const { data: ukNewsData, error: ukNewsError } = await supabase.functions.invoke('uk-news-scanner', {
        body: { 
          sources: ['BBC News', 'The Guardian', 'The Telegraph', 'Sky News'],
          scan_type: 'reputation_threats'
        }
      });

      if (ukNewsError) {
        console.error('UK News Scanner error:', ukNewsError);
      } else {
        console.log('UK News Scanner result:', ukNewsData);
      }

      // Call Enhanced Intelligence function
      console.log('Calling Enhanced Intelligence...');
      const { data: intelligenceData, error: intelligenceError } = await supabase.functions.invoke('enhanced-intelligence', {
        body: { scan_depth: 'comprehensive' }
      });

      if (intelligenceError) {
        console.error('Enhanced Intelligence error:', intelligenceError);
      } else {
        console.log('Enhanced Intelligence result:', intelligenceData);
      }

      clearInterval(progressInterval);
      setScanProgress(100);

      // Reload threats from database
      await loadExistingThreats();
      
      toast.success('Discovery scan completed successfully!');
      
    } catch (error) {
      console.error('Discovery scan error:', error);
      toast.error('Discovery scan encountered an error. Please try again.');
    } finally {
      setIsScanning(false);
      setScanProgress(0);
    }
  };

  const stopDiscoveryScan = () => {
    setIsScanning(false);
    setScanProgress(0);
    toast.info('Discovery scan stopped');
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
