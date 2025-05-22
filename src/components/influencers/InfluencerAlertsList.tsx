import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Send, Mail, MessageSquare, Eye, RefreshCw, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { 
  InfluencerAlert, 
  getInfluencerAlerts,
  sendEmailOutreach,
  sendDMOutreach,
  updateInfluencerStatus 
} from "@/services/influencers/influencerOutreachService";

const InfluencerAlertsList = () => {
  const [alerts, setAlerts] = useState<InfluencerAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: "new", platform: "", severity: "" });
  const [selectedAlert, setSelectedAlert] = useState<InfluencerAlert | null>(null);
  const [sendingOutreach, setSendingOutreach] = useState(false);

  useEffect(() => {
    loadAlerts();
  }, [filter]);

  const loadAlerts = async () => {
    setLoading(true);
    const data = await getInfluencerAlerts(100, filter);
    setAlerts(data);
    setLoading(false);
  };

  const handleStatusChange = (status: string) => {
    setFilter({ ...filter, status });
  };

  const handlePlatformChange = (platform: string) => {
    setFilter({ ...filter, platform });
  };

  const handleSeverityChange = (severity: string) => {
    setFilter({ ...filter, severity });
  };

  const handleRefresh = () => {
    loadAlerts();
    toast.info("Refreshing influencer alerts");
  };

  const handleSelectAlert = (alert: InfluencerAlert) => {
    setSelectedAlert(alert);
  };

  const handleSendEmail = async (alert: InfluencerAlert) => {
    setSendingOutreach(true);
    try {
      const success = await sendEmailOutreach(alert);
      if (success) {
        // Refresh the list to reflect the updated status
        loadAlerts();
      }
    } finally {
      setSendingOutreach(false);
    }
  };

  const handleSendDM = async (alert: InfluencerAlert) => {
    setSendingOutreach(true);
    try {
      const success = await sendDMOutreach(alert);
      if (success) {
        // Refresh the list to reflect the updated status
        loadAlerts();
      }
    } finally {
      setSendingOutreach(false);
    }
  };

  const handleIgnore = async (alert: InfluencerAlert) => {
    const success = await updateInfluencerStatus(alert.id, 'ignored');
    if (success) {
      toast.info(`Marked ${alert.influencer_name} as ignored`);
      loadAlerts();
    } else {
      toast.error("Failed to update status");
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge variant="destructive">High Risk</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Medium Risk</Badge>;
      case 'low':
        return <Badge variant="outline">Low Risk</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="secondary" className="bg-blue-500 hover:bg-blue-600">New</Badge>;
      case 'contacted':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-200">Contacted</Badge>;
      case 'responded':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200">Responded</Badge>;
      case 'converted':
        return <Badge variant="outline" className="bg-green-500 text-white hover:bg-green-600">Converted</Badge>;
      case 'ignored':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-200">Ignored</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Influencer Risk Intelligence</h2>
        <Button onClick={handleRefresh} variant="outline" size="sm" className="gap-1">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Refresh
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <div>
          <Select value={filter.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="responded">Responded</SelectItem>
              <SelectItem value="converted">Converted</SelectItem>
              <SelectItem value="ignored">Ignored</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select value={filter.platform} onValueChange={handlePlatformChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Platforms</SelectItem>
              <SelectItem value="Instagram">Instagram</SelectItem>
              <SelectItem value="TikTok">TikTok</SelectItem>
              <SelectItem value="YouTube">YouTube</SelectItem>
              <SelectItem value="Twitter">Twitter/X</SelectItem>
              <SelectItem value="Twitch">Twitch</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select value={filter.severity} onValueChange={handleSeverityChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Severities</SelectItem>
              <SelectItem value="high">High Risk</SelectItem>
              <SelectItem value="medium">Medium Risk</SelectItem>
              <SelectItem value="low">Low Risk</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          <ScrollArea className="h-[600px]">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : alerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <AlertTriangle className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No influencer alerts found</p>
                <Button variant="link" onClick={handleRefresh}>
                  Refresh List
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {alerts.map((alert) => (
                  <Card 
                    key={alert.id} 
                    className={`cursor-pointer hover:border-primary transition-colors ${selectedAlert?.id === alert.id ? 'border-primary' : ''}`}
                    onClick={() => handleSelectAlert(alert)}
                  >
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base">{alert.influencer_name}</CardTitle>
                          <div className="flex items-center gap-1 mt-1">
                            <Badge variant="outline">{alert.platform}</Badge>
                            {getStatusBadge(alert.status)}
                          </div>
                        </div>
                        <div>
                          {getSeverityBadge(alert.severity)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 pb-2">
                      <p className="text-sm line-clamp-2">{alert.controversy_type}</p>
                      <div className="text-xs text-muted-foreground mt-1">
                        <span>Source: {alert.source}</span>
                        <span className="mx-1">•</span>
                        <span>Detected: {formatDate(alert.detected_at)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        <div className="lg:col-span-2">
          {selectedAlert ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{selectedAlert.influencer_name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{selectedAlert.platform}</Badge>
                      {getSeverityBadge(selectedAlert.severity)}
                      {getStatusBadge(selectedAlert.status)}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Detected: {formatDate(selectedAlert.detected_at)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="details">
                  <TabsList className="mb-4">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="outreach">Outreach</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="details">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium mb-1">Controversy Type</h3>
                        <p>{selectedAlert.controversy_type}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-1">Content</h3>
                        <p className="text-sm">{selectedAlert.content}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium mb-1">Source</h3>
                          <p className="text-sm">{selectedAlert.source}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium mb-1">Platform</h3>
                          <p className="text-sm">{selectedAlert.platform}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium mb-1">Sentiment Score</h3>
                          <p className="text-sm">{selectedAlert.sentiment_score || "N/A"}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium mb-1">Opportunity Score</h3>
                          <p className="text-sm">{selectedAlert.opportunity_score || "N/A"}</p>
                        </div>
                      </div>
                      
                      {selectedAlert.source_url && (
                        <div>
                          <h3 className="text-sm font-medium mb-1">Source URL</h3>
                          <a 
                            href={selectedAlert.source_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline text-sm"
                          >
                            {selectedAlert.source_url}
                          </a>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="outreach">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Outreach Options</h3>
                        <p className="text-sm mb-4">
                          Send an automated outreach message explaining how A.R.I.A. can help {selectedAlert.influencer_name} 
                          with their current situation related to {selectedAlert.controversy_type}.
                        </p>
                        
                        <div className="flex flex-col gap-3">
                          <Button 
                            onClick={() => handleSendEmail(selectedAlert)}
                            disabled={sendingOutreach || selectedAlert.status !== 'new'}
                            className="justify-start"
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            {sendingOutreach ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Sending Email...
                              </>
                            ) : (
                              "Send Automated Email Outreach"
                            )}
                          </Button>
                          
                          <Button 
                            onClick={() => handleSendDM(selectedAlert)}
                            disabled={sendingOutreach || selectedAlert.status !== 'new'}
                            className="justify-start"
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            {sendingOutreach ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Sending DM...
                              </>
                            ) : (
                              "Send Platform DM Outreach"
                            )}
                          </Button>
                          
                          <Button 
                            variant="outline"
                            onClick={() => handleIgnore(selectedAlert)}
                            disabled={sendingOutreach || selectedAlert.status !== 'new'}
                            className="justify-start"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Mark as Ignored
                          </Button>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <p className="text-xs text-muted-foreground">
                          Automated outreach will use our AI to generate a personalized message for {selectedAlert.influencer_name} 
                          based on their specific situation. The message will introduce A.R.I.A.'s services and explain how we can help
                          with their current reputation issue.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-xs text-muted-foreground">
                  ID: {selectedAlert.id}
                </p>
                <p className="text-xs text-muted-foreground">
                  Created: {formatDate(selectedAlert.created_at)}
                </p>
              </CardFooter>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="flex flex-col items-center py-12 text-center">
                <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Influencer Selected</h3>
                <p className="text-muted-foreground">
                  Select an influencer alert from the list to view details and send outreach
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfluencerAlertsList;
