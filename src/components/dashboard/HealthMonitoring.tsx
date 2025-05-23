
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Activity, Bell, Settings, TestTube } from "lucide-react";
import { testHealthAlerts } from "@/services/notifications/healthAlertService";

const HealthMonitoring = () => {
  const [slackWebhook, setSlackWebhook] = useState('');
  const [discordWebhook, setDiscordWebhook] = useState('');
  const [emailRecipients, setEmailRecipients] = useState('');
  const [slackEnabled, setSlackEnabled] = useState(false);
  const [discordEnabled, setDiscordEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [isTestingAlerts, setIsTestingAlerts] = useState(false);

  const handleTestAlerts = async () => {
    setIsTestingAlerts(true);
    
    const channels = {
      slack: {
        webhookUrl: slackWebhook,
        enabled: slackEnabled && !!slackWebhook
      },
      discord: {
        webhookUrl: discordWebhook,
        enabled: discordEnabled && !!discordWebhook
      },
      email: {
        recipients: emailRecipients.split(',').map(email => email.trim()).filter(Boolean),
        enabled: emailEnabled && !!emailRecipients
      }
    };

    try {
      await testHealthAlerts(channels);
      toast.success('Test alerts sent successfully');
    } catch (error) {
      toast.error('Failed to send test alerts');
      console.error('Alert test error:', error);
    } finally {
      setIsTestingAlerts(false);
    }
  };

  const saveSettings = () => {
    // In a real implementation, this would save to database/localStorage
    localStorage.setItem('aria_health_monitoring', JSON.stringify({
      slack: { webhookUrl: slackWebhook, enabled: slackEnabled },
      discord: { webhookUrl: discordWebhook, enabled: discordEnabled },
      email: { recipients: emailRecipients, enabled: emailEnabled }
    }));
    
    toast.success('Health monitoring settings saved');
  };

  // Load settings on component mount
  React.useEffect(() => {
    const saved = localStorage.getItem('aria_health_monitoring');
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        setSlackWebhook(settings.slack?.webhookUrl || '');
        setSlackEnabled(settings.slack?.enabled || false);
        setDiscordWebhook(settings.discord?.webhookUrl || '');
        setDiscordEnabled(settings.discord?.enabled || false);
        setEmailRecipients(settings.email?.recipients || '');
        setEmailEnabled(settings.email?.enabled || false);
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            ARIA Health Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Daily Health Checks</p>
                      <p className="text-xs text-muted-foreground">Automated via GitHub Actions</p>
                    </div>
                    <Badge variant="outline" className="bg-green-50">Active</Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Alert Channels</p>
                      <p className="text-xs text-muted-foreground">
                        {[slackEnabled, discordEnabled, emailEnabled].filter(Boolean).length} configured
                      </p>
                    </div>
                    <Badge variant="outline">
                      {[slackEnabled, discordEnabled, emailEnabled].some(Boolean) ? 'Configured' : 'Setup Required'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Last Check</p>
                      <p className="text-xs text-muted-foreground">Daily at 9:00 AM UTC</p>
                    </div>
                    <Badge variant="outline" className="bg-blue-50">Scheduled</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Alert Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="slack" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="slack">Slack</TabsTrigger>
              <TabsTrigger value="discord">Discord</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
            </TabsList>
            
            <TabsContent value="slack" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="slack-enabled">Enable Slack Alerts</Label>
                  <Switch
                    id="slack-enabled"
                    checked={slackEnabled}
                    onCheckedChange={setSlackEnabled}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="slack-webhook">Slack Webhook URL</Label>
                  <Input
                    id="slack-webhook"
                    type="url"
                    placeholder="https://hooks.slack.com/services/..."
                    value={slackWebhook}
                    onChange={(e) => setSlackWebhook(e.target.value)}
                    disabled={!slackEnabled}
                  />
                  <p className="text-xs text-muted-foreground">
                    Create a webhook at slack.com/apps/manage/custom-integrations
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="discord" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="discord-enabled">Enable Discord Alerts</Label>
                  <Switch
                    id="discord-enabled"
                    checked={discordEnabled}
                    onCheckedChange={setDiscordEnabled}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="discord-webhook">Discord Webhook URL</Label>
                  <Input
                    id="discord-webhook"
                    type="url"
                    placeholder="https://discord.com/api/webhooks/..."
                    value={discordWebhook}
                    onChange={(e) => setDiscordWebhook(e.target.value)}
                    disabled={!discordEnabled}
                  />
                  <p className="text-xs text-muted-foreground">
                    Create a webhook in your Discord server settings
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="email" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-enabled">Enable Email Alerts</Label>
                  <Switch
                    id="email-enabled"
                    checked={emailEnabled}
                    onCheckedChange={setEmailEnabled}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email-recipients">Email Recipients</Label>
                  <Input
                    id="email-recipients"
                    type="email"
                    placeholder="admin@company.com, ops@company.com"
                    value={emailRecipients}
                    onChange={(e) => setEmailRecipients(e.target.value)}
                    disabled={!emailEnabled}
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate multiple emails with commas
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex gap-2 pt-4">
            <Button onClick={saveSettings} variant="default">
              <Settings className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
            
            <Button 
              onClick={handleTestAlerts} 
              variant="outline"
              disabled={isTestingAlerts || ![slackEnabled, discordEnabled, emailEnabled].some(Boolean)}
            >
              <TestTube className="h-4 w-4 mr-2" />
              {isTestingAlerts ? 'Testing...' : 'Test Alerts'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthMonitoring;
