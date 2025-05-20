
import { useState, useEffect } from "react";
import { ContentAlert, ContentSource, ContentAction } from "@/types/dashboard";
import { supabase } from '@/integrations/supabase/client';
import { getContentAlerts, getContentActions, getMonitoredPlatforms } from "@/services/scanResultsService";

export const useDashboardData = () => {
  const [filteredAlerts, setFilteredAlerts] = useState<ContentAlert[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  
  // State for metrics
  const [reputationScore, setReputationScore] = useState(0);
  const [previousScore, setPreviousScore] = useState(0);
  const [sources, setSources] = useState<ContentSource[]>([]);
  const [alerts, setAlerts] = useState<ContentAlert[]>([]);
  const [actions, setActions] = useState<ContentAction[]>([]);
  const [monitoredSources, setMonitoredSources] = useState(0);
  const [negativeContent, setNegativeContent] = useState(0);
  const [removedContent, setRemovedContent] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      
      try {
        // Get alerts
        const alertsData = await getContentAlerts(20, 0);
        const formattedAlerts = alertsData.map(alert => ({
          id: alert.id,
          platform: alert.platform,
          content: alert.content,
          date: new Date(alert.created_at).toLocaleString(),
          severity: alert.severity,
          status: alert.status,
          threatType: alert.threat_type,
          confidenceScore: alert.confidence_score,
          sourceType: alert.source_type,
          sentiment: alert.sentiment,
          potentialReach: alert.potential_reach,
          detectedEntities: alert.detected_entities
        }));
        
        setAlerts(formattedAlerts);
        setFilteredAlerts(formattedAlerts);
        
        // Count negative content
        const negativeCount = alertsData.filter(alert => 
          alert.severity === 'high' || alert.severity === 'medium'
        ).length;
        setNegativeContent(negativeCount);
        
        // Get actions
        const actionsData = await getContentActions(10, 0);
        const formattedActions = actionsData.map(action => ({
          id: action.id,
          type: action.type,
          description: action.description,
          timestamp: new Date(action.created_at).toLocaleString(),
          status: action.status,
          user: action.user_id,
          platform: action.platform,
          action: action.action,
          date: new Date(action.created_at).toLocaleString()
        }));
        
        setActions(formattedActions);
        
        // Count removed content
        const removedCount = actionsData.filter(action => 
          action.type === 'removal' && action.status === 'completed'
        ).length;
        setRemovedContent(removedCount);
        
        // Get monitored platforms
        const platformsData = await getMonitoredPlatforms();
        const formattedSources = platformsData.map(platform => ({
          id: platform.id,
          name: platform.name,
          status: platform.sentiment < 0 ? 'critical' : platform.sentiment > 20 ? 'good' : 'warning',
          positiveRatio: platform.positive_ratio || 0,
          total: platform.total || 0,
          active: platform.active,
          lastUpdated: platform.last_updated ? new Date(platform.last_updated).toLocaleString() : 'Never',
          mentionCount: platform.mention_count || 0,
          sentiment: platform.sentiment || 0
        }));
        
        setSources(formattedSources);
        setMonitoredSources(platformsData.length);
        
        // Calculate reputation score based on alerts and actions
        const highSeverityCount = alertsData.filter(a => a.severity === 'high').length;
        const mediumSeverityCount = alertsData.filter(a => a.severity === 'medium').length;
        const resolvedCount = actionsData.filter(a => a.status === 'completed' || a.status === 'resolved').length;
        
        // Simple formula: start at 70, subtract for issues, add for resolutions
        const calculatedScore = Math.max(0, Math.min(100, 
          70 - (highSeverityCount * 5) - (mediumSeverityCount * 2) + (resolvedCount * 3)
        ));
        
        setReputationScore(calculatedScore);
        setPreviousScore(Math.max(0, calculatedScore - 5)); // Simulate previous score
        
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInitialData();
    
    // Set up real-time listening for changes
    const channel = supabase
      .channel('db-changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'scan_results' }, 
        (payload) => {
          // Update alerts when new scan results arrive
          fetchInitialData();
        }
      )
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'content_actions' },
        (payload) => {
          // Update actions when new actions are added
          fetchInitialData();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    filteredAlerts, 
    setFilteredAlerts,
    startDate,
    setStartDate,
    endDate, 
    setEndDate,
    reputationScore, 
    setReputationScore,
    previousScore, 
    setPreviousScore,
    sources, 
    setSources,
    alerts, 
    setAlerts,
    actions, 
    setActions,
    monitoredSources, 
    setMonitoredSources,
    negativeContent, 
    setNegativeContent,
    removedContent, 
    setRemovedContent,
    isLoading
  };
};
