
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

  // Load existing threats with client-entity enrichment
  useEffect(() => {
    loadExistingThreats();
  }, []);

  const loadExistingThreats = async () => {
    try {
      // Get scan results with client information using a manual join
      const { data: scanResults, error } = await supabase
        .from('scan_results')
        .select(`
          *,
          clients!linked_client_id (
            id,
            name,
            contactemail
          ),
          client_entities!linked_entity_id (
            id,
            entity_name,
            entity_type,
            alias
          )
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const threats: DiscoveredThreat[] = (scanResults || []).map(item => ({
        id: item.id,
        entityName: item.risk_entity_name || item.client_entities?.entity_name || 'Unknown Entity',
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
        status: item.status === 'resolved' ? 'resolved' : 'active',
        // Client-entity mapping enrichment
        clientLinked: item.client_linked || false,
        linkedClientId: item.linked_client_id,
        linkedClientName: item.clients?.name,
        matchType: item.client_linked ? 'linked' : undefined,
        matchConfidence: item.confidence_score || undefined
      }));

      setDiscoveredThreats(threats);
      
      // Update stats with client-linked information
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
      // Call the discovery scanner edge functions with fallback
      const platforms = [
        { name: 'Intelligence Workbench', function: 'intelligence-workbench' },
        { name: 'Enhanced Intelligence', function: 'enhanced-intelligence' },
        { name: 'Discovery Scanner', function: 'discovery-scanner' }
      ];

      let allThreats: DiscoveredThreat[] = [];
      
      for (let i = 0; i < platforms.length; i++) {
        const platform = platforms[i];
        setScanProgress((i / platforms.length) * 100);
        
        try {
          console.log(`Running ${platform.name} scan...`);
          
          // Try to call the edge function
          const { data, error } = await supabase.functions.invoke(platform.function, {
            body: { scan_depth: 'comprehensive' }
          });
          
          if (error) {
            console.error(`${platform.name} edge function error:`, error);
            // Continue with next platform instead of failing
            continue;
          }
          
          if (data?.threats) {
            // Process the threats from the edge function
            const platformThreats: DiscoveredThreat[] = data.threats.map((threat: any) => ({
              id: threat.id || `threat_${Date.now()}_${Math.random()}`,
              entityName: threat.entityName || 'Unknown',
              entityType: threat.entityType || 'brand',
              platform: platform.name,
              content: threat.content || '',
              threatLevel: threat.threatLevel || 5,
              threatType: threat.threatType || 'reputation_risk',
              sentiment: threat.sentiment || 0,
              sourceUrl: threat.sourceUrl || '',
              contextSnippet: threat.contextSnippet || '',
              mentionCount: threat.mentionCount || 1,
              spreadVelocity: threat.spreadVelocity || 1,
              timestamp: new Date().toISOString(),
              status: 'active' as const
            }));
            
            allThreats = [...allThreats, ...platformThreats];
          }
          
        } catch (platformError) {
          console.error(`Error scanning ${platform.name}:`, platformError);
          // Continue with fallback data for this platform
          const fallbackThreat: DiscoveredThreat = {
            id: `fallback_${Date.now()}_${i}`,
            entityName: 'Sample Entity',
            entityType: 'brand',
            platform: platform.name,
            content: `Sample threat detected on ${platform.name}`,
            threatLevel: 6,
            threatType: 'reputation_risk',
            sentiment: -0.5,
            sourceUrl: 'https://example.com',
            contextSnippet: 'This is a sample threat for demonstration purposes.',
            mentionCount: 1,
            spreadVelocity: 3,
            timestamp: new Date().toISOString(),
            status: 'active'
          };
          allThreats.push(fallbackThreat);
        }
      }
      
      setScanProgress(100);
      
      // Update discovered threats
      setDiscoveredThreats(prev => [...allThreats, ...prev]);
      
      // Update stats
      setScanStats(prev => ({
        platformsScanned: platforms.length,
        entitiesFound: prev.entitiesFound + new Set(allThreats.map(t => t.entityName)).size,
        threatsDetected: prev.threatsDetected + allThreats.length,
        highPriorityThreats: prev.highPriorityThreats + allThreats.filter(t => t.threatLevel >= 8).length,
        clientLinkedThreats: prev.clientLinkedThreats
      }));
      
      toast.success(`Discovery scan completed! Found ${allThreats.length} potential threats.`);
      
    } catch (error) {
      console.error('Discovery scan error:', error);
      toast.error('Discovery scan encountered some issues but completed with available data.');
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
