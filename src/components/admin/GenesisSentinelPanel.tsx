
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Shield, Search, AlertTriangle, TrendingUp, Users, Globe } from 'lucide-react';
import { toast } from 'sonner';

const GenesisSentinelPanel = () => {
  const [activeTab, setActiveTab] = useState('discovery');
  const [entityName, setEntityName] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleEntityScan = async () => {
    if (!entityName.trim()) {
      toast.error('Please enter an entity name to scan');
      return;
    }

    setIsScanning(true);
    toast.success(`🔍 Genesis Sentinel: Initiating deep intelligence scan for "${entityName}"`);
    
    // Simulate scan process
    setTimeout(() => {
      setIsScanning(false);
      toast.success(`📊 Intelligence scan complete for "${entityName}" - 12 data points collected`);
    }, 3000);
  };

  return (
    <Card className="corporate-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 corporate-heading">
          <Shield className="h-5 w-5 text-corporate-accent" />
          Genesis Sentinel Console
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-corporate-darkSecondary border border-corporate-border">
            <TabsTrigger value="discovery" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
              Entity Discovery
            </TabsTrigger>
            <TabsTrigger value="risk" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
              Risk Intelligence
            </TabsTrigger>
            <TabsTrigger value="leads" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
              Lead Generation
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
              Live Monitoring
            </TabsTrigger>
          </TabsList>

          <TabsContent value="discovery" className="space-y-4 mt-6">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter entity name or domain to discover..."
                  value={entityName}
                  onChange={(e) => setEntityName(e.target.value)}
                  className="flex-1 bg-corporate-darkSecondary border-corporate-border text-white"
                />
                <Button
                  onClick={handleEntityScan}
                  disabled={isScanning}
                  className="bg-corporate-accent text-black hover:bg-corporate-accentDark"
                >
                  <Search className="h-4 w-4 mr-2" />
                  {isScanning ? 'Scanning...' : 'Discover'}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-corporate-darkSecondary border-corporate-border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="h-4 w-4 text-blue-400" />
                      <span className="text-sm font-medium text-white">Registry Monitoring</span>
                    </div>
                    <p className="text-xs text-corporate-lightGray">
                      Track new business registrations and domain launches
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-corporate-darkSecondary border-corporate-border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-green-400" />
                      <span className="text-sm font-medium text-white">Director Intelligence</span>
                    </div>
                    <p className="text-xs text-corporate-lightGray">
                      Monitor director appointments and corporate changes
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-corporate-darkSecondary border-corporate-border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-purple-400" />
                      <span className="text-sm font-medium text-white">Media Tracking</span>
                    </div>
                    <p className="text-xs text-corporate-lightGray">
                      Detect emerging mentions before they trend
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="risk" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-corporate-darkSecondary border-corporate-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-white flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                    High Risk Entities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-corporate-lightGray">Crypto Ventures Ltd</span>
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Critical</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-corporate-lightGray">Offshore Holdings Inc</span>
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">High</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-corporate-darkSecondary border-corporate-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-white flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-400" />
                    Risk Trends
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-xs text-corporate-lightGray">
                    <div>↑ Litigation risk increased 15% this week</div>
                    <div>↓ Regulatory compliance improved 8%</div>
                    <div>→ Media sentiment stable</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="leads" className="space-y-4 mt-6">
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-corporate-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Automated Lead Generation
              </h3>
              <p className="text-corporate-lightGray max-w-md mx-auto">
                Genesis Sentinel automatically identifies potential clients based on risk patterns 
                and emerging reputation threats.
              </p>
              <Button className="mt-4 bg-corporate-accent text-black hover:bg-corporate-accentDark">
                View Lead Pipeline
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-green-500/10 border-green-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-green-400">Monitoring Status</div>
                      <div className="text-xs text-green-300">All systems operational</div>
                    </div>
                    <div className="h-3 w-3 rounded-full bg-green-400 animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-corporate-darkSecondary border-corporate-border">
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-white mb-1">Active Monitors</div>
                  <div className="text-lg font-bold text-corporate-accent">247</div>
                  <div className="text-xs text-corporate-lightGray">Entities under surveillance</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default GenesisSentinelPanel;
