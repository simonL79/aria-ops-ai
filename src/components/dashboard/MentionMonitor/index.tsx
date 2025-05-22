
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThreatFeed } from '@/components/dashboard/ThreatFeed';
import { ContentAlert } from '@/types/dashboard';
import { getMentionsAsAlerts, runMonitoringScan } from '@/services/monitoring';
import { Loader, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const MentionMonitor = () => {
  const [alerts, setAlerts] = useState<ContentAlert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [scanning, setScanning] = useState<boolean>(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    loadAlerts();
  }, []);
  
  const loadAlerts = async () => {
    setLoading(true);
    try {
      const mentionAlerts = await getMentionsAsAlerts();
      setAlerts(mentionAlerts);
    } catch (error) {
      console.error('Error loading alerts:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleScan = async () => {
    setScanning(true);
    try {
      await runMonitoringScan();
      // Reload alerts after scan
      await loadAlerts();
    } catch (error) {
      console.error('Error running scan:', error);
    } finally {
      setScanning(false);
    }
  };
  
  const handleViewDetails = (alert: ContentAlert) => {
    navigate(`/dashboard/mentions?alert=${alert.id}`);
  };
  
  const getEntityBadges = () => {
    // Get unique entities from all alerts
    const allEntities = alerts.flatMap(alert => alert.detectedEntities || []);
    const uniqueEntities = [...new Set(allEntities)].slice(0, 3); // Show top 3 entities
    
    return uniqueEntities.map((entity, index) => (
      <Badge key={index} variant="outline" className="mr-1">
        {String(entity)}
      </Badge>
    ));
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl">Mentions Monitor</CardTitle>
          <CardDescription>
            Real-time monitoring of brand mentions across platforms
          </CardDescription>
          <div className="mt-2 flex flex-wrap gap-1">
            <span className="text-sm text-muted-foreground mr-1">Tracking:</span>
            {alerts.length > 0 ? getEntityBadges() : (
              <Badge variant="outline">No entities detected</Badge>
            )}
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1"
          onClick={handleScan}
          disabled={scanning}
        >
          {scanning ? (
            <>
              <Loader size={14} className="animate-spin" />
              <span>Scanning...</span>
            </>
          ) : (
            <>
              <RefreshCw size={14} className="mr-1" />
              <span>Scan Now</span>
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <ThreatFeed 
          alerts={alerts} 
          isLoading={loading}
          onViewDetails={handleViewDetails}
        />
      </CardContent>
    </Card>
  );
};

export default MentionMonitor;
