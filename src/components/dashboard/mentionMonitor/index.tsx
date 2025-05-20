
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge'; 
import { Activity } from 'lucide-react';
import { 
  getMonitoringStatus, 
  startMonitoring, 
  stopMonitoring,
  runMonitoringScan
} from '@/services';
import { 
  getAllMentions, 
  saveMention 
} from '@/services';
import { ContentAlert } from '@/types/dashboard';
import { classifyContent, storeMention } from '@/services/api/mentionsApiService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { getMentionsAsAlerts } from '@/services';

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

  const handleViewAllMentions = () => {
    navigate('/dashboard/mentions');
  };

  const handleClassifyContent = async (platform: string, content: string): Promise<void> => {
    try {
      // Classify the content
      const classification = await classifyContent(
        content,
        platform,
        "YourBrand" // This would come from context in a real app
      );
      
      if (classification) {
        // Create a new mention from the classification
        const severityMap: Record<number, 'low' | 'medium' | 'high'> = {
          1: 'low', 2: 'low', 3: 'low',
          4: 'medium', 5: 'medium', 6: 'medium',
          7: 'high', 8: 'high', 9: 'high', 10: 'high'
        };
        
        const newMention = await storeMention({
          platform: platform,
          content: content,
          date: new Date().toISOString().split('T')[0],
          severity: severityMap[classification.severity] || 'medium',
          category: classification.category,
          recommendation: classification.recommendation,
          ai_reasoning: classification.ai_reasoning,
          sourceType: 'manual'
        });
        
        // Add to last mentions
        setLastMentions(prev => [newMention, ...prev].slice(0, 5));
        
        // Notify parent component
        if (onNewMentionsFound) {
          onNewMentionsFound([newMention]);
        }
        
        toast.success('Content classified and stored');
      }
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
            sourcesCount={status.sources}
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
