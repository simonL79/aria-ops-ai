
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; 
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Users, Share2, Bell, Mail, AlertTriangle, Target } from "lucide-react";
import RealTimeAlerts from "@/components/dashboard/real-time-alerts";
import ThreatFeed from "@/components/dashboard/ThreatFeed";
import ThreatAnalysisHub from "@/components/dashboard/ThreatAnalysisHub";
import { ContentAlert } from "@/types/dashboard";
import { registerAlertListener, unregisterAlertListener } from "@/services/aiScraping/mockScanner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { EmailDigestSettings } from "@/types/aiScraping";
import { scheduleEmailDigest } from "@/services/notifications/emailNotificationService";

const EngagementHubPage = () => {
  const location = useLocation();
  const [selectedAlert, setSelectedAlert] = useState<ContentAlert | null>(null);
  const [alerts, setAlerts] = useState<ContentAlert[]>([]);
  const [emailSettings, setEmailSettings] = useState<{
    enabled: boolean;
    emailAddress: string;
  }>({
    enabled: false,
    emailAddress: ""
  });

  // Handle URL query parameter for direct alert viewing and retrieve from sessionStorage
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const alertId = queryParams.get('alert');
    
    // Try to get the alert from sessionStorage first
    const storedAlertData = sessionStorage.getItem('selectedAlert');
    
    if (storedAlertData) {
      try {
        const storedAlert = JSON.parse(storedAlertData);
        setSelectedAlert(storedAlert);
        
        // Remove from sessionStorage to prevent it from persisting across page refreshes
        sessionStorage.removeItem('selectedAlert');
        
        // Add the alert to the alerts list if it's not already there
        setAlerts(prev => {
          if (!prev.some(a => a.id === storedAlert.id)) {
            return [storedAlert, ...prev];
          }
          return prev;
        });
        
        // Show toast notification for high severity alerts
        if (storedAlert.severity === 'high') {
          toast.warning(`Analyzing ${storedAlert.platform} alert`, {
            description: "Our threat analysis system is analyzing this alert."
          });
        }
        
        return; // We've found our alert, no need to continue
      } catch (e) {
        console.error("Error parsing stored alert:", e);
      }
    }
    
    // If we couldn't get it from sessionStorage, try to find it in the alerts list
    if (alertId && alerts.length > 0) {
      const alert = alerts.find(a => a.id === alertId);
      if (alert) {
        setSelectedAlert(alert);
      }
    }
  }, [location.search, alerts]);

  // Function to handle new alerts from AI Scraping
  const handleNewAlert = (alert: ContentAlert) => {
    setAlerts(prev => [alert, ...prev]);
    
    // If this is a high priority alert, show toast
    if (alert.severity === 'high' && alert.status === 'new') {
      toast.warning(`New ${alert.platform} alert`, {
        description: alert.content.substring(0, 60) + (alert.content.length > 60 ? '...' : ''),
        action: {
          label: "View Details",
          onClick: () => setSelectedAlert(alert)
        }
      });
    }
  };

  // Register to listen for alerts from the AI Scraping system
  useEffect(() => {
    const cleanupFunction = registerAlertListener(handleNewAlert);
    
    return () => {
      cleanupFunction();
    };
  }, []);

  const handleViewDetails = (alert: ContentAlert) => {
    setSelectedAlert(alert);
    
    // Show analysis toast for high severity alerts
    if (alert.severity === 'high') {
      toast.info(`Analyzing ${alert.platform} content`, {
        description: "Our threat analysis system is processing this content."
      });
    }
  };

  const handleDismiss = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
    
    if (selectedAlert && selectedAlert.id === id) {
      setSelectedAlert(null);
    }
  };

  const handleMarkAsRead = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, status: 'read' } : alert
    ));
  };

  const handleEmailToggle = (checked: boolean) => {
    setEmailSettings(prev => ({ ...prev, enabled: checked }));
    
    if (checked && !emailSettings.emailAddress) {
      toast.warning("Please enter an email address to receive notifications");
    } else if (checked) {
      toast.success("Email notifications enabled", {
        description: `Notifications will be sent to ${emailSettings.emailAddress}`
      });
      
      // Schedule daily digest
      const digestSettings: EmailDigestSettings = {
        enabled: true,
        frequency: 'daily',
        minRiskScore: 5,
        recipients: [emailSettings.emailAddress],
        lastSent: undefined
      };
      
      scheduleEmailDigest(digestSettings);
    } else {
      toast.info("Email notifications disabled");
    }
  };

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Engagement Hub"
        description="Manage all communication and engagement activities"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-1">
          <div className="space-y-4">
            <RealTimeAlerts 
              alerts={alerts}
              onViewDetail={handleViewDetails}
              onMarkAsRead={handleMarkAsRead}
              onDismiss={handleDismiss}
            />
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Mail className="mr-2 h-5 w-5" />
                  Email Notifications
                </CardTitle>
                <CardDescription>
                  Configure email alerts for high priority items
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="email-notifications" 
                      checked={emailSettings.enabled}
                      onCheckedChange={handleEmailToggle}
                    />
                    <Label htmlFor="email-notifications">Enable email notifications</Label>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email-address">Email address</Label>
                    <Input 
                      id="email-address" 
                      placeholder="your@email.com" 
                      type="email"
                      value={emailSettings.emailAddress}
                      onChange={(e) => setEmailSettings(prev => ({ 
                        ...prev, 
                        emailAddress: e.target.value 
                      }))}
                    />
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    High priority alerts and customer enquiries will be sent to this email address
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          {selectedAlert ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Alert Analysis</h2>
                <Button variant="outline" onClick={() => setSelectedAlert(null)}>
                  Back to Feed
                </Button>
              </div>
              
              <Card className="mb-4">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      {selectedAlert.platform} Alert
                    </CardTitle>
                    <Badge variant={
                      selectedAlert.severity === 'high' ? 'destructive' : 
                      selectedAlert.severity === 'medium' ? 'default' : 
                      'secondary'
                    }>
                      {selectedAlert.severity} Priority
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-2">
                    <span>{selectedAlert.date}</span>
                    {selectedAlert.url && (
                      <a 
                        href={selectedAlert.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Source
                      </a>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Content</Label>
                    <p className="mt-1 p-3 bg-muted rounded-md">{selectedAlert.content}</p>
                  </div>

                  {/* Threat Information */}
                  {selectedAlert.threatType && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        <span className="font-medium text-amber-800">Threat Detected</span>
                      </div>
                      <p className="text-amber-700">
                        <strong>Type:</strong> {selectedAlert.threatType.replace('_', ' ').charAt(0).toUpperCase() + selectedAlert.threatType.replace('_', ' ').slice(1)}
                      </p>
                    </div>
                  )}

                  {/* Detected Entities */}
                  {selectedAlert.detectedEntities && selectedAlert.detectedEntities.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Detected Entities
                      </Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedAlert.detectedEntities.map((entity, idx) => (
                          <Badge key={idx} variant="outline">
                            {entity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Additional Information */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {selectedAlert.sourceType && (
                      <div>
                        <Label className="text-muted-foreground">Source Type</Label>
                        <p className="font-medium">{selectedAlert.sourceType}</p>
                      </div>
                    )}
                    {selectedAlert.confidenceScore && (
                      <div>
                        <Label className="text-muted-foreground">Confidence</Label>
                        <p className="font-medium">{selectedAlert.confidenceScore}%</p>
                      </div>
                    )}
                    {selectedAlert.potentialReach && (
                      <div>
                        <Label className="text-muted-foreground">Potential Reach</Label>
                        <p className="font-medium">{selectedAlert.potentialReach.toLocaleString()}</p>
                      </div>
                    )}
                    {selectedAlert.sentiment && (
                      <div>
                        <Label className="text-muted-foreground">Sentiment</Label>
                        <p className="font-medium capitalize">{selectedAlert.sentiment}</p>
                      </div>
                    )}
                  </div>

                  {/* Category Information */}
                  {selectedAlert.category === 'customer_enquiry' && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="text-blue-800">
                        <strong>Customer Enquiry:</strong> This appears to be a customer enquiry that requires a response.
                      </p>
                    </div>
                  )}

                  {/* Recommendation */}
                  {selectedAlert.recommendation && (
                    <div>
                      <Label className="text-sm font-medium">Recommended Action</Label>
                      <p className="mt-1 p-3 bg-green-50 border border-green-200 rounded-md text-green-800">
                        {selectedAlert.recommendation}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <ThreatAnalysisHub 
                initialContent={selectedAlert.content}
                threatType={selectedAlert.threatType}
                severity={selectedAlert.severity}
                platform={selectedAlert.platform}
              />
            </div>
          ) : (
            <ThreatFeed 
              alerts={alerts}
              onViewDetails={handleViewDetails}
            />
          )}
        </div>
      </div>

      {!selectedAlert && (
        <Tabs defaultValue="messages" className="w-full">
          <TabsList className="mb-3 overflow-x-auto flex whitespace-nowrap w-full max-w-full">
            <TabsTrigger value="messages" className="px-3">Messages</TabsTrigger>
            <TabsTrigger value="comments" className="px-3">Comments</TabsTrigger>
            <TabsTrigger value="mentions" className="px-3">Social Mentions</TabsTrigger>
            <TabsTrigger value="notifications" className="px-3">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="messages" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Direct Messages
                </CardTitle>
                <CardDescription>
                  Manage direct messages from various platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No new messages to display.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="comments" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Comment Management
                </CardTitle>
                <CardDescription>
                  Monitor and respond to comments across platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No new comments to moderate.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="mentions" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Share2 className="mr-2 h-5 w-5" />
                  Social Media Mentions
                </CardTitle>
                <CardDescription>
                  Track all social media mentions and engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No new social media mentions detected.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  Notification Center
                </CardTitle>
                <CardDescription>
                  Manage notification settings and alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No new notifications available.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </DashboardLayout>
  );
};

export default EngagementHubPage;
