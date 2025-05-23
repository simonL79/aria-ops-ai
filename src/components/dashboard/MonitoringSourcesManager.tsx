import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Loader, 
  RefreshCw, 
  Check, 
  X,
  Globe,
  Rss,
  Star,
  MessageSquare,
  Briefcase,
  Settings,
  Plus,
  Users,
  Trophy,
  Camera
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MonitoringSource {
  id: string;
  name: string;
  type: 'social' | 'news' | 'review' | 'forum';
  platform: string;
  enabled: boolean;
  lastScan?: string;
  status: 'active' | 'inactive' | 'error';
  icon: React.ReactNode;
  description: string;
  requiresSetup?: boolean;
}

interface ScanResult {
  source: string;
  status: string;
  matches_found: number;
  processed: number;
  results: any[];
}

const MonitoringSourcesManager = () => {
  const [sources, setSources] = useState<MonitoringSource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [scanResults, setScanResults] = useState<Record<string, ScanResult>>({});
  const [customRSSUrl, setCustomRSSUrl] = useState('');

  // Initialize default sources focused on public figures
  useEffect(() => {
    const defaultSources: MonitoringSource[] = [
      {
        id: 'reddit',
        name: 'Reddit Scanner',
        type: 'social',
        platform: 'Reddit',
        enabled: true,
        status: 'active',
        icon: <MessageSquare className="h-4 w-4" />,
        description: 'Monitors subreddits for threat-related discussions about public figures',
        lastScan: 'Active (hourly scans)'
      },
      {
        id: 'rss-news',
        name: 'Celebrity & Sports News',
        type: 'news',
        platform: 'Entertainment & Sports Media',
        enabled: true,
        status: 'active',
        icon: <Camera className="h-4 w-4" />,
        description: 'Monitors TMZ, Page Six, ESPN, Sports Illustrated and other celebrity/sports outlets'
      },
      {
        id: 'twitter',
        name: 'Twitter/X Monitor',
        type: 'social',
        platform: 'X (Twitter)',
        enabled: false,
        status: 'inactive',
        icon: <Globe className="h-4 w-4" />,
        description: 'Real-time Twitter monitoring for celebrity mentions and trending topics',
        requiresSetup: true
      },
      {
        id: 'instagram-monitoring',
        name: 'Instagram Monitoring',
        type: 'social',
        platform: 'Instagram',
        enabled: false,
        status: 'inactive',
        icon: <Camera className="h-4 w-4" />,
        description: 'Monitor Instagram posts and stories for public figure content',
        requiresSetup: true
      },
      {
        id: 'tiktok-monitoring',
        name: 'TikTok Monitoring',
        type: 'social',
        platform: 'TikTok',
        enabled: false,
        status: 'inactive',
        icon: <Users className="h-4 w-4" />,
        description: 'Track viral TikTok content and trends involving public figures',
        requiresSetup: true
      },
      {
        id: 'youtube-monitoring',
        name: 'YouTube Monitoring',
        type: 'social',
        platform: 'YouTube',
        enabled: false,
        status: 'inactive',
        icon: <Trophy className="h-4 w-4" />,
        description: 'Monitor YouTube videos and comments for celebrity/sports content',
        requiresSetup: true
      },
      {
        id: 'linkedin',
        name: 'LinkedIn Monitoring',
        type: 'social',
        platform: 'LinkedIn',
        enabled: false,
        status: 'inactive',
        icon: <Briefcase className="h-4 w-4" />,
        description: 'Monitor professional athlete and celebrity business activities',
        requiresSetup: true
      }
    ];
    setSources(defaultSources);
  }, []);

  const triggerScan = async (sourceId: string) => {
    setIsLoading(true);
    try {
      let functionName = '';
      
      switch (sourceId) {
        case 'reddit':
          functionName = 'reddit-scan';
          break;
        case 'rss-news':
          functionName = 'rss-scraper';
          break;
        default:
          toast.error('Scanner not yet implemented for this source');
          return;
      }

      const { data, error } = await supabase.functions.invoke(functionName);
      
      if (error) {
        throw new Error(error.message);
      }
      
      setScanResults(prev => ({
        ...prev,
        [sourceId]: data
      }));
      
      // Update last scan time
      setSources(prev => prev.map(source => 
        source.id === sourceId 
          ? { ...source, lastScan: new Date().toLocaleString(), status: 'active' as const }
          : source
      ));
      
      const sourceName = sources.find(s => s.id === sourceId)?.name;
      const contentType = sourceId === 'rss-news' ? 'celebrity/sports threats' : 'potential threats';
      
      toast.success(`${sourceName} scan completed`, {
        description: `Found ${data.matches_found || 0} ${contentType}`
      });
    } catch (error) {
      console.error('Error triggering scan:', error);
      toast.error('Scan failed', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
      
      // Update status to error
      setSources(prev => prev.map(source => 
        source.id === sourceId 
          ? { ...source, status: 'error' as const }
          : source
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSource = (sourceId: string, enabled: boolean) => {
    setSources(prev => prev.map(source => 
      source.id === sourceId 
        ? { ...source, enabled }
        : source
    ));
    
    const sourceName = sources.find(s => s.id === sourceId)?.name;
    toast.success(`${sourceName} ${enabled ? 'enabled' : 'disabled'}`);
  };

  const addCustomRSSFeed = () => {
    if (!customRSSUrl.trim()) {
      toast.error('Please enter a valid RSS URL');
      return;
    }
    
    const newSource: MonitoringSource = {
      id: `custom-rss-${Date.now()}`,
      name: `Custom Celebrity/Sports Feed`,
      type: 'news',
      platform: 'Custom',
      enabled: true,
      status: 'inactive',
      icon: <Rss className="h-4 w-4" />,
      description: customRSSUrl
    };
    
    setSources(prev => [...prev, newSource]);
    setCustomRSSUrl('');
    toast.success('Custom celebrity/sports RSS feed added');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Active</Badge>;
      case 'error':
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Error</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-50 text-gray-600">Inactive</Badge>;
    }
  };

  const filterByType = (type: string) => {
    return sources.filter(source => type === 'all' || source.type === type);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Celebrity & Sports Monitoring Sources
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All Sources</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="news">News & Entertainment</TabsTrigger>
            <TabsTrigger value="review">Reviews</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {sources.map(source => (
              <SourceCard 
                key={source.id} 
                source={source} 
                onToggle={toggleSource}
                onScan={triggerScan}
                isLoading={isLoading}
                scanResult={scanResults[source.id]}
                getStatusBadge={getStatusBadge}
              />
            ))}
          </TabsContent>
          
          <TabsContent value="social" className="space-y-4">
            {filterByType('social').map(source => (
              <SourceCard 
                key={source.id} 
                source={source} 
                onToggle={toggleSource}
                onScan={triggerScan}
                isLoading={isLoading}
                scanResult={scanResults[source.id]}
                getStatusBadge={getStatusBadge}
              />
            ))}
          </TabsContent>
          
          <TabsContent value="news" className="space-y-4">
            {filterByType('news').map(source => (
              <SourceCard 
                key={source.id} 
                source={source} 
                onToggle={toggleSource}
                onScan={triggerScan}
                isLoading={isLoading}
                scanResult={scanResults[source.id]}
                getStatusBadge={getStatusBadge}
              />
            ))}
          </TabsContent>
          
          <TabsContent value="review" className="space-y-4">
            {filterByType('review').map(source => (
              <SourceCard 
                key={source.id} 
                source={source} 
                onToggle={toggleSource}
                onScan={triggerScan}
                isLoading={isLoading}
                scanResult={scanResults[source.id]}
                getStatusBadge={getStatusBadge}
              />
            ))}
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="rss-url">Add Custom Celebrity/Sports RSS Feed</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="rss-url"
                        placeholder="https://celebrity-news-site.com/rss.xml"
                        value={customRSSUrl}
                        onChange={(e) => setCustomRSSUrl(e.target.value)}
                      />
                      <Button onClick={addCustomRSSFeed}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {sources.filter(s => s.id.startsWith('custom-')).map(source => (
              <SourceCard 
                key={source.id} 
                source={source} 
                onToggle={toggleSource}
                onScan={triggerScan}
                isLoading={isLoading}
                scanResult={scanResults[source.id]}
                getStatusBadge={getStatusBadge}
              />
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

interface SourceCardProps {
  source: MonitoringSource;
  onToggle: (id: string, enabled: boolean) => void;
  onScan: (id: string) => void;
  isLoading: boolean;
  scanResult?: ScanResult;
  getStatusBadge: (status: string) => React.ReactNode;
}

const SourceCard: React.FC<SourceCardProps> = ({
  source,
  onToggle,
  onScan,
  isLoading,
  scanResult,
  getStatusBadge
}) => {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3">
          <div className="bg-gray-100 p-2 rounded-md">
            {source.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{source.name}</h3>
              {getStatusBadge(source.status)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {source.description}
            </p>
            {source.lastScan && (
              <p className="text-xs text-muted-foreground mt-2">
                Last scan: {source.lastScan}
              </p>
            )}
            {scanResult && (
              <div className="mt-2 text-xs">
                <span className="text-green-600">
                  Found {scanResult.matches_found} threats, processed {scanResult.processed}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {source.requiresSetup ? (
            <Button size="sm" variant="outline" disabled>
              Setup Required
            </Button>
          ) : source.enabled && !source.requiresSetup && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onScan(source.id)}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          )}
          
          <Switch 
            checked={source.enabled}
            onCheckedChange={(checked) => onToggle(source.id, checked)}
            disabled={source.requiresSetup}
          />
        </div>
      </div>
      
      {source.requiresSetup && (
        <Alert className="mt-3">
          <AlertDescription>
            This source requires API credentials and additional setup. 
            Contact support to enable this monitoring source.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default MonitoringSourcesManager;
