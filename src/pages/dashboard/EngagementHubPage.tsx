
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; 
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Users, Share2, Bell, Mail } from "lucide-react";
import RealTimeAlerts from "@/components/dashboard/real-time-alerts";
import ThreatFeed from "@/components/dashboard/ThreatFeed";
import ThreatAnalysisHub from "@/components/dashboard/ThreatAnalysisHub";
import { ContentAlert } from "@/types/dashboard";
import { registerAlertListener, unregisterAlertListener } from "@/services/aiScraping/mockScanner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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

  // Handle URL query parameter for direct alert viewing
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const alertId = queryParams.get('alert');
    
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
  };

  // Register to listen for alerts from the AI Scraping system
  useEffect(() => {
    registerAlertListener(handleNewAlert);
    
    return () => {
      unregisterAlertListener(handleNewAlert);
    };
  }, []);

  const handleViewDetails = (alert: ContentAlert) => {
    setSelectedAlert(alert);
  };

  const handleDismiss = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1">
          <RealTimeAlerts 
            alerts={alerts}
            onViewDetail={handleViewDetails}
            onMarkAsRead={handleMarkAsRead}
            onDismiss={handleDismiss}
          />
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="mr-2 h-5 w-5" />
                Email Notifications
              </CardTitle>
              <CardDescription>
                Configure email alerts for high priority items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
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
        
        <div className="lg:col-span-2">
          {selectedAlert ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Alert Analysis</h2>
                <Button variant="outline" onClick={() => setSelectedAlert(null)}>
                  Back to Feed
                </Button>
              </div>
              
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{selectedAlert.platform} Alert</CardTitle>
                    <div className={`px-2 py-1 text-xs rounded-full ${
                      selectedAlert.severity === 'high' 
                        ? 'bg-red-100 text-red-800' 
                        : selectedAlert.severity === 'medium' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {selectedAlert.severity} Priority
                    </div>
                  </div>
                  <CardDescription>{selectedAlert.date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{selectedAlert.content}</p>
                  {selectedAlert.category === 'customer_enquiry' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-blue-800 text-sm mb-4">
                      This is a customer enquiry and requires a response.
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
          <TabsList className="mb-4">
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="mentions">Social Mentions</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="messages" className="space-y-4">
            <Card>
              <CardHeader>
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
              <CardHeader>
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
              <CardHeader>
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
              <CardHeader>
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
