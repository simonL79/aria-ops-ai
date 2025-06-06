
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Server, 
  Shield, 
  Database, 
  Bell,
  Key,
  Globe,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

const SystemSettingsPage = () => {
  const [localServerUrl, setLocalServerUrl] = useState('http://localhost:3001');
  const [autoScanning, setAutoScanning] = useState(true);
  const [realTimeAlerts, setRealTimeAlerts] = useState(true);
  const [dataRetention, setDataRetention] = useState('90');
  const [threatThreshold, setThreatThreshold] = useState('5');

  const handleSaveSettings = () => {
    toast.success('System settings saved successfully');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">System Settings</h1>
          <p className="text-muted-foreground">Configure A.R.I.A™ system parameters</p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="local-ai">Local AI</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  General Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="auto-scanning">Auto OSINT Scanning</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically scan for new threats
                        </p>
                      </div>
                      <Switch
                        id="auto-scanning"
                        checked={autoScanning}
                        onCheckedChange={setAutoScanning}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="real-time-alerts">Real-time Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Instant notifications for high-risk threats
                        </p>
                      </div>
                      <Switch
                        id="real-time-alerts"
                        checked={realTimeAlerts}
                        onCheckedChange={setRealTimeAlerts}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="threat-threshold">Threat Alert Threshold</Label>
                      <Input
                        id="threat-threshold"
                        type="number"
                        min="1"
                        max="10"
                        value={threatThreshold}
                        onChange={(e) => setThreatThreshold(e.target.value)}
                        className="mt-1"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Minimum threat level for alerts (1-10)
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="data-retention">Data Retention (days)</Label>
                      <Input
                        id="data-retention"
                        type="number"
                        value={dataRetention}
                        onChange={(e) => setDataRetention(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="local-ai">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Local AI Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="local-server-url">Local AI Server URL</Label>
                  <Input
                    id="local-server-url"
                    value={localServerUrl}
                    onChange={(e) => setLocalServerUrl(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    URL for your local Ollama server
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Threat Classification</h4>
                        <p className="text-sm text-muted-foreground">AI-powered threat analysis</p>
                      </div>
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Content Summarization</h4>
                        <p className="text-sm text-muted-foreground">Intelligent content analysis</p>
                      </div>
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Memory Search</h4>
                        <p className="text-sm text-muted-foreground">Vector-based intelligence search</p>
                      </div>
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Legal Analysis</h4>
                        <p className="text-sm text-muted-foreground">Legal risk assessment</p>
                      </div>
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    </div>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>API Rate Limiting</Label>
                      <p className="text-sm text-muted-foreground mb-2">
                        Current: 1000 requests/hour per client
                      </p>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>

                    <div>
                      <Label>Data Encryption</Label>
                      <p className="text-sm text-muted-foreground mb-2">
                        All data encrypted at rest and in transit
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Active</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Access Logs</Label>
                      <p className="text-sm text-muted-foreground mb-2">
                        Comprehensive audit trail enabled
                      </p>
                      <Button variant="outline" size="sm">View Logs</Button>
                    </div>

                    <div>
                      <Label>Session Management</Label>
                      <p className="text-sm text-muted-foreground mb-2">
                        Auto-logout after 24 hours of inactivity
                      </p>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">847</div>
                      <p className="text-sm text-muted-foreground">Intelligence Records</p>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">2.3GB</div>
                      <p className="text-sm text-muted-foreground">Total Data Storage</p>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">15</div>
                      <p className="text-sm text-muted-foreground">Edge Functions</p>
                    </div>
                  </Card>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Automatic Data Cleanup</Label>
                      <p className="text-sm text-muted-foreground">
                        Remove old scan results after retention period
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Data Export</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable data export for compliance
                      </p>
                    </div>
                    <Button variant="outline" size="sm">Export Data</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Alert Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Send alerts via email
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Browser push notifications
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Webhook Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Send alerts to external systems
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="alert-email">Alert Email</Label>
                      <Input
                        id="alert-email"
                        type="email"
                        placeholder="admin@yourcompany.com"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="webhook-url">Webhook URL</Label>
                      <Input
                        id="webhook-url"
                        type="url"
                        placeholder="https://your-webhook-endpoint.com"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button onClick={handleSaveSettings} className="w-full md:w-auto">
            Save All Settings
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SystemSettingsPage;
