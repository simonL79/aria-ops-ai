
import { useState, useEffect } from 'react';
import { ContentAlert } from '@/types/dashboard';
import { supabase } from "@/integrations/supabase/client";

const useAlertSimulation = (interval: number = 60000) => {
  const [alert, setAlert] = useState<ContentAlert | null>(null);

  useEffect(() => {
    const fetchLatestAlert = async () => {
      try {
        const { data, error } = await supabase
          .from('scan_results')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (error) {
          console.error('Error fetching latest alert:', error);
          return;
        }

        if (data && data.length > 0) {
          const item = data[0];
          setAlert({
            id: item.id,
            platform: item.platform,
            content: item.content,
            date: new Date(item.created_at).toISOString(),
            severity: item.severity as 'high' | 'medium' | 'low',
            status: item.status,
            url: item.url || '',
            sourceType: item.source_type || 'scan',
            confidenceScore: item.confidence_score || 75,
            sentiment: item.sentiment > 0 ? 'positive' : item.sentiment < 0 ? 'negative' : 'neutral',
            detectedEntities: item.detected_entities || [],
            category: 'Real-time Detection'
          });
        }
      } catch (error) {
        console.error('Error fetching real alert:', error);
      }
    };

    // Fetch immediately
    fetchLatestAlert();

    // Set up interval to check for new alerts
    const timer = setInterval(fetchLatestAlert, interval);

    return () => clearInterval(timer);
  }, [interval]);

  return alert;
};

export default useAlertSimulation;
