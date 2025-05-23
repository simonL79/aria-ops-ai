import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, Filter, RefreshCw, AlertTriangle, Link, 
  Clock, User, Building, Calendar, ArrowUpRight
} from "lucide-react";
import { ContentAlert } from "@/types/dashboard";
import { getMentionsAsAlerts } from "@/services/monitoring/alerts";
import { toast } from "sonner";
import ResultItem from "@/components/aiScraping/dashboard/ResultItem";
import { runMonitoringScan } from '@/services/monitoring/scan';
import { useNavigate } from 'react-router-dom';

const MentionsPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRunningManualScan, setIsRunningManualScan] = useState<boolean>(false);
  const [mentions, setMentions] = useState<ContentAlert[]>([]);
  const [filter, setFilter] = useState({
    severity: 'all',
    platform: 'all',
    search: '',
    sortBy: 'date',
    entityType: 'all'
  });
  
  useEffect(() => {
    fetchMentions();
  }, []);
  
  const fetchMentions = async () => {
    setIsLoading(true);
    try {
      const alerts = await getMentionsAsAlerts();
      
      // Sort by date (newest first)
      const sortedAlerts = [...alerts].sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      
      setMentions(sortedAlerts);
    } catch (error) {
      console.error("Error fetching mentions:", error);
      toast.error("Failed to load mentions");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleManualScan = async () => {
    setIsRunningManualScan(true);
    try {
      await runMonitoringScan();
      // Refresh mentions after scan completes
      await fetchMentions();
      toast.success("Scan completed successfully");
    } catch (error) {
      console.error("Error running manual scan:", error);
      toast.error("Failed to run scan");
    } finally {
      setIsRunningManualScan(false);
    }
  };
  
  const handleViewAndRespond = (mentionId: string) => {
    // Store the selected alert in sessionStorage for retrieval on the engagement page
    const selectedAlert = mentions.find(mention => mention.id === mentionId);
    if (selectedAlert) {
      sessionStorage.setItem('selectedAlert', JSON.stringify(selectedAlert));
      // Navigate to engagement page with alert ID as a URL parameter
      navigate(`/dashboard/engagement?alert=${mentionId}`);
    }
  };
  
  const filteredMentions = mentions.filter(mention => {
    // Apply severity filter
    if (filter.severity !== 'all' && mention.severity !== filter.severity) {
      return false;
    }
    
    // Apply platform filter
    if (filter.platform !== 'all' && mention.platform !== filter.platform) {
      return false;
    }
    
    // Apply entity type filter if available
    if (filter.entityType !== 'all' && mention.sourceType !== filter.entityType) {
      return false;
    }
    
    // Apply search filter (case insensitive)
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      const contentMatch = mention.content.toLowerCase().includes(searchLower);
      const platformMatch = mention.platform.toLowerCase().includes(searchLower);
      const entityMatch = mention.detectedEntities ? 
        mention.detectedEntities.some(entity => 
          String(entity).toLowerCase().includes(searchLower)
        ) : false;
      
      return contentMatch || platformMatch || entityMatch;
    }
    
    return true;
  });
  
  // Sort mentions based on selection
  const sortedMentions = [...filteredMentions].sort((a, b) => {
    switch (filter.sortBy) {
      case 'date':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'severity':
        const severityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
      case 'platform':
        return a.platform.localeCompare(b.platform);
      case 'reach':
        return (b.potentialReach || 0) - (a.potentialReach || 0);
      default:
        return 0;
    }
  });
  
  // Extract unique platforms for filter dropdown
  const platforms = [...new Set(mentions.map(mention => mention.platform))];
  
  // Extract unique source types for filter dropdown
  const sourceTypes = [...new Set(mentions
    .filter(mention => mention.sourceType)
    .map(mention => mention.sourceType)
  )];
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mentions & Alerts</h1>
        <Button 
          onClick={handleManualScan} 
          disabled={isRunningManualScan}
          className="gap-2"
        >
          {isRunningManualScan ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Running Scan...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              Run New Scan
            </>
          )}
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex justify-between items-center">
            <span>Detailed Mentions</span>
            <Badge variant="secondary">
              {filteredMentions.length} Results
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="col-span-1 md:col-span-3">
              <Input
                placeholder="Search by content, platform, or entity..."
                value={filter.search}
                onChange={(e) => setFilter({...filter, search: e.target.value})}
                className="w-full"
              />
            </div>
            <div>
              <Select
                value={filter.severity}
                onValueChange={(value) => setFilter({...filter, severity: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select
                value={filter.platform}
                onValueChange={(value) => setFilter({...filter, platform: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  {platforms.map((platform) => (
                    <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Select
                value={filter.entityType}
                onValueChange={(value) => setFilter({...filter, entityType: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Source Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  {sourceTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select
                value={filter.sortBy}
                onValueChange={(value) => setFilter({...filter, sortBy: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Most Recent</SelectItem>
                  <SelectItem value="severity">Highest Severity</SelectItem>
                  <SelectItem value="platform">Platform</SelectItem>
                  <SelectItem value="reach">Potential Reach</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : sortedMentions.length === 0 ? (
            <div className="py-12 text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-1">No mentions found</h3>
              <p className="text-gray-500">
                {filter.search || filter.severity !== 'all' || filter.platform !== 'all' || filter.entityType !== 'all' ? 
                  'Try adjusting your filters' : 
                  'No mentions have been detected yet'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <Tabs defaultValue="card" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="card">Card View</TabsTrigger>
                  <TabsTrigger value="detail">Detailed View</TabsTrigger>
                </TabsList>
                
                <TabsContent value="card">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sortedMentions.map((mention) => (
                      <Card key={mention.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                <Badge className={`${
                                  mention.severity === 'high' ? 'bg-red-500' : 
                                  mention.severity === 'medium' ? 'bg-yellow-500' : 
                                  'bg-green-500'
                                } text-white`}>
                                  {mention.severity}
                                </Badge>
                                <span className="font-medium">{mention.platform}</span>
                              </div>
                              <div className="flex items-center text-xs text-gray-500">
                                <Clock className="h-3 w-3 mr-1" />
                                {mention.date}
                              </div>
                            </div>
                            
                            <p className="mt-2">{mention.content}</p>
                            
                            {/* Entities / Who it's about */}
                            {mention.detectedEntities && mention.detectedEntities.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                <span className="text-xs text-gray-500 mr-1">About:</span>
                                {mention.detectedEntities.map((entity, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs py-0">
                                    {String(entity)}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            
                            {/* Additional details */}
                            <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-500">
                              {mention.sourceType && (
                                <div className="flex items-center gap-1">
                                  <span className="font-medium">Source type:</span> 
                                  {mention.sourceType}
                                </div>
                              )}
                              {mention.confidenceScore && (
                                <div className="flex items-center gap-1">
                                  <span className="font-medium">Confidence:</span> 
                                  {mention.confidenceScore}%
                                </div>
                              )}
                              {mention.threatType && (
                                <div className="flex items-center gap-1">
                                  <span className="font-medium">Threat type:</span> 
                                  {mention.threatType}
                                </div>
                              )}
                              {mention.potentialReach && (
                                <div className="flex items-center gap-1">
                                  <span className="font-medium">Potential reach:</span> 
                                  {mention.potentialReach.toLocaleString()}
                                </div>
                              )}
                            </div>
                            
                            {/* Action buttons */}
                            <div className="mt-3 flex justify-end">
                              {mention.url && (
                                <Button variant="outline" size="sm" asChild className="mr-2">
                                  <a href={mention.url} target="_blank" rel="noopener noreferrer">
                                    <ArrowUpRight className="h-3 w-3 mr-1" />
                                    Source
                                  </a>
                                </Button>
                              )}
                              <Button 
                                variant="default" 
                                size="sm" 
                                onClick={() => handleViewAndRespond(mention.id)}
                              >
                                View & Respond
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="detail">
                  <div className="space-y-4">
                    {sortedMentions.map((mention) => (
                      <ResultItem 
                        key={mention.id} 
                        result={{
                          ...mention,
                          onViewDetail: () => handleViewAndRespond(mention.id)
                        }}
                      />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MentionsPage;
