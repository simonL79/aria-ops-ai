
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader, Activity, Globe, Bell, Eye, Ban, Shield, Send } from 'lucide-react';
import { 
  getMonitoringStatus, 
  startMonitoring, 
  stopMonitoring, 
  runMonitoringScan,
  getMentionsAsAlerts
} from '@/services/monitoringService';
import { ContentAlert } from '@/types/dashboard';
import { ThreatClassificationResult } from '@/types/intelligence/threats';
import { classifyContent, storeMention } from '@/services/api/mentionsApiService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface MentionMonitorProps {
  onNewMentionsFound?: (mentions: ContentAlert[]) => void;
}

const MentionMonitor = ({ onNewMentionsFound }: MentionMonitorProps) => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [status, setStatus] = useState(getMonitoringStatus());
  const [lastMentions, setLastMentions] = useState<ContentAlert[]>([]);
  const [customContent, setCustomContent] = useState("");
  const [customPlatform, setCustomPlatform] = useState("Twitter");
  const [isClassifying, setIsClassifying] = useState(false);

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

  const handleClassifyContent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customContent.trim()) {
      toast.error('Please enter content to classify');
      return;
    }
    
    setIsClassifying(true);
    
    try {
      // Classify the content
      const classification = await classifyContent(
        customContent,
        customPlatform,
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
          platform: customPlatform,
          content: customContent,
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
        setCustomContent("");
      }
    } catch (error) {
      toast.error('Error classifying content');
      console.error(error);
    } finally {
      setIsClassifying(false);
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
          
          {/* Manual content classification form */}
          <div className="border rounded-md p-3 mt-2">
            <h3 className="text-sm font-medium mb-2">Manual Content Classification</h3>
            <form onSubmit={handleClassifyContent} className="space-y-3">
              <div className="grid gap-2">
                <Label htmlFor="platform">Platform</Label>
                <select
                  id="platform"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={customPlatform}
                  onChange={(e) => setCustomPlatform(e.target.value)}
                >
                  <option value="Twitter">Twitter</option>
                  <option value="Reddit">Reddit</option>
                  <option value="Google News">Google News</option>
                  <option value="Discord">Discord</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Telegram">Telegram</option>
                  <option value="WhatsApp">WhatsApp</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">Content</Label>
                <Input
                  id="content"
                  placeholder="Enter content to classify..."
                  value={customContent}
                  onChange={(e) => setCustomContent(e.target.value)}
                />
              </div>
              <Button 
                type="submit" 
                size="sm" 
                className="w-full"
                disabled={isClassifying || !customContent.trim()}
              >
                {isClassifying ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Classifying...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Classify & Store
                  </>
                )}
              </Button>
            </form>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium">Latest Mentions</p>
              <Button variant="ghost" size="sm" onClick={handleViewAllMentions}>
                <Eye className="mr-2 h-4 w-4" />
                View All
              </Button>
            </div>
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
