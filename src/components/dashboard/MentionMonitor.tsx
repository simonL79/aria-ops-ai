
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader, Activity, Globe, Bell, Eye, Ban, Shield } from 'lucide-react';
import { 
  getMonitoringStatus, 
  startMonitoring, 
  stopMonitoring, 
  runMonitoringScan,
  getMentionsAsAlerts
} from '@/services/monitoringService';
import { ContentAlert } from '@/types/dashboard';
import { toast } from 'sonner';

interface MentionMonitorProps {
  onNewMentionsFound?: (mentions: ContentAlert[]) => void;
}

const MentionMonitor = ({ onNewMentionsFound }: MentionMonitorProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [status, setStatus] = useState(getMonitoringStatus());
  const [lastMentions, setLastMentions] = useState<ContentAlert[]>([]);

  // Update status periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(getMonitoringStatus());
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleStartMonitoring = () => {
    startMonitoring();
    setStatus(getMonitoringStatus());
    toast.success('Brand mention monitoring started');
  };

  const handleStopMonitoring = () => {
    stopMonitoring();
    setStatus(getMonitoringStatus());
    toast.info('Brand mention monitoring paused');
  };

  const handleScanNow = async () => {
    setIsScanning(true);
    try {
      await runMonitoringScan();
      setStatus(getMonitoringStatus());
      
      // Get any new mentions
      const newMentions = getMentionsAsAlerts();
      setLastMentions(newMentions);
      
      if (newMentions.length > 0) {
        toast.success(`${newMentions.length} new brand mentions found`);
        if (onNewMentionsFound) {
          onNewMentionsFound(newMentions);
        }
      } else {
        toast.info('No new mentions found in this scan');
      }
    } catch (error) {
      toast.error('Error during monitoring scan');
      console.error(error);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          <span>Brand Mention Monitor</span>
          <Badge variant={status.isActive ? "default" : "outline"} className="ml-2">
            {status.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </CardTitle>
        <CardDescription>
          Monitor and track brand mentions across multiple platforms
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Monitoring Status</p>
              <p className="text-sm text-muted-foreground">
                {status.isActive 
                  ? `Next automated scan at ${status.nextRun.toLocaleTimeString()}`
                  : 'Monitoring is currently disabled'}
              </p>
            </div>
            <div>
              {status.isActive ? (
                <Button variant="outline" size="sm" onClick={handleStopMonitoring}>
                  <Ban className="mr-2 h-4 w-4" />
                  Pause
                </Button>
              ) : (
                <Button size="sm" onClick={handleStartMonitoring}>
                  <Bell className="mr-2 h-4 w-4" />
                  Start
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">Sources</p>
              <p className="text-sm text-muted-foreground">
                {status.sources} platforms connected
              </p>
            </div>
            <div>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={isScanning}
                onClick={handleScanNow}
              >
                {isScanning ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Globe className="mr-2 h-4 w-4" />
                    Scan Now
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-2">Latest Mentions</p>
            {lastMentions.length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {lastMentions.slice(0, 3).map((mention) => (
                  <div key={mention.id} className="border rounded-md p-2 text-sm">
                    <div className="flex justify-between items-center mb-1">
                      <Badge variant="outline">{mention.platform}</Badge>
                      <span className="text-xs text-muted-foreground">{mention.date}</span>
                    </div>
                    <p className="line-clamp-2">{mention.content}</p>
                    {mention.category && (
                      <div className="mt-1 flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          <Shield className="h-3 w-3 mr-1" />
                          {mention.category}
                        </Badge>
                        {mention.severity === 'high' && (
                          <Badge variant="destructive" className="text-xs">
                            High Priority
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {lastMentions.length > 3 && (
                  <Button variant="ghost" size="sm" className="w-full text-xs">
                    <Eye className="mr-2 h-3 w-3" />
                    View {lastMentions.length - 3} more mentions
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-4 text-sm text-muted-foreground">
                No recent mentions found. Run a scan to check for new mentions.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MentionMonitor;
