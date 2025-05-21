
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge'; 
import { Activity } from 'lucide-react';
import { 
  getMonitoringStatus, 
  startMonitoring, 
  stopMonitoring,
  runMonitoringScan
} from '@/services/monitoring';
import { ContentAlert } from '@/types/dashboard';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { getMentionsAsAlerts } from '@/services/monitoring/alerts';

// Import the sub-components
import MonitoringStatus from './MonitoringStatus';
import SourcesInfo from './SourcesInfo';
import ManualClassificationForm from './ManualClassificationForm';
import LatestMentions from './LatestMentions';

interface MentionMonitorProps {
  onNewMentionsFound?: (mentions: ContentAlert[]) => void;
}

const MentionMonitor = ({ onNewMentionsFound }: MentionMonitorProps) => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [status, setStatus] = useState<any>({ isActive: false, sources: 0 });
  const [lastMentions, setLastMentions] = useState<ContentAlert[]>([]);

  // Fetch initial status
  useEffect(() => {
    const fetchInitialStatus = async () => {
      try {
        const monitoringStatus = await getMonitoringStatus();
        setStatus(monitoringStatus);
        
        // Fetch initial mentions
        const initialMentions = await getMentionsAsAlerts();
        setLastMentions(initialMentions);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };
    
    fetchInitialStatus();
  }, []);

  // Update status periodically
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const monitoringStatus = await getMonitoringStatus();
        setStatus(monitoringStatus);
      } catch (error) {
        console.error("Error updating monitoring status:", error);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleStartMonitoring = async () => {
    await startMonitoring();
    const updatedStatus = await getMonitoringStatus();
    setStatus(updatedStatus);
    toast.success('Brand mention monitoring started');
  };

  const handleStopMonitoring = async () => {
    await stopMonitoring();
    const updatedStatus = await getMonitoringStatus();
    setStatus(updatedStatus);
    toast.info('Brand mention monitoring paused');
  };

  const handleScanNow = async () => {
    setIsScanning(true);
    try {
      await runMonitoringScan();
      const updatedStatus = await getMonitoringStatus();
      setStatus(updatedStatus);
      
      // Get any new mentions
      const newMentions = await getMentionsAsAlerts();
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

  const handleViewAllMentions = () => {
    navigate('/dashboard/mentions');
  };

  const handleClassifyContent = async (platform: string, content: string): Promise<void> => {
    try {
      // Simulate content classification (in a real app this would call an AI service)
      const severityOptions: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
      const severity = severityOptions[Math.floor(Math.random() * severityOptions.length)];
      
      // Create new mention with simplified data
      const newMention: ContentAlert = {
        id: `mention-${Date.now()}`,
        platform,
        content,
        date: new Date().toLocaleString(),
        severity,
        status: 'new',
        sourceType: 'manual'
      };
      
      // Add to last mentions
      setLastMentions(prev => [newMention, ...prev].slice(0, 5));
      
      // Notify parent component
      if (onNewMentionsFound) {
        onNewMentionsFound([newMention]);
      }
      
      toast.success('Content classified and stored');
    } catch (error) {
      toast.error('Error classifying content');
      console.error(error);
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
          <MonitoringStatus 
            status={status}
            onStart={handleStartMonitoring}
            onStop={handleStopMonitoring}
          />
          
          <SourcesInfo 
            sourcesCount={status.sources || 0}
            isScanning={isScanning}
            onScan={handleScanNow}
          />
          
          <ManualClassificationForm onClassify={handleClassifyContent} />
          
          <LatestMentions 
            mentions={lastMentions}
            onViewAll={handleViewAllMentions}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MentionMonitor;
