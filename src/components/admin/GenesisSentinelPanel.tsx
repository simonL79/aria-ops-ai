
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, Search, AlertTriangle, TrendingUp, Users, Globe, Clock, CheckCircle, Target, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface DiscoveredEntity {
  id: string;
  name: string;
  type: 'company' | 'individual' | 'domain';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  lastSeen: string;
  confidence: number;
}

interface LeadProspect {
  id: string;
  entityName: string;
  riskScore: number;
  threatType: string;
  priority: 'low' | 'medium' | 'high';
  estimatedValue: string;
}

const GenesisSentinelPanel = () => {
  const [activeTab, setActiveTab] = useState('discovery');
  const [entityName, setEntityName] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [discoveredEntities, setDiscoveredEntities] = useState<DiscoveredEntity[]>([
    {
      id: '1',
      name: 'TechCorp Industries',
      type: 'company',
      riskLevel: 'medium',
      lastSeen: '2 hours ago',
      confidence: 87
    },
    {
      id: '2',
      name: 'suspicious-domain.net',
      type: 'domain',
      riskLevel: 'high',
      lastSeen: '15 minutes ago',
      confidence: 94
    }
  ]);

  const [leadProspects, setLeadProspects] = useState<LeadProspect[]>([
    {
      id: '1',
      entityName: 'Emerging Fintech Ltd',
      riskScore: 78,
      threatType: 'Regulatory Risk',
      priority: 'high',
      estimatedValue: '£45,000'
    },
    {
      id: '2',
      entityName: 'Global Ventures Corp',
      riskScore: 65,
      threatType: 'Media Exposure',
      priority: 'medium',
      estimatedValue: '£28,000'
    }
  ]);

  const handleEntityScan = async () => {
    if (!entityName.trim()) {
      toast.error('Please enter an entity name to scan');
      return;
    }

    setIsScanning(true);
    setScanProgress(0);
    toast.success(`🔍 Genesis Sentinel: Initiating deep intelligence scan for "${entityName}"`);
    
    // Simulate progressive scan
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    setTimeout(() => {
      setIsScanning(false);
      setScanProgress(0);
      
      // Add mock discovered entity
      const newEntity: DiscoveredEntity = {
        id: Date.now().toString(),
        name: entityName,
        type: 'company',
        riskLevel: Math.random() > 0.5 ? 'medium' : 'high',
        lastSeen: 'Just now',
        confidence: Math.floor(Math.random() * 30) + 70
      };
      
      setDiscoveredEntities(prev => [newEntity, ...prev]);
      toast.success(`📊 Intelligence scan complete for "${entityName}" - ${Math.floor(Math.random() * 20) + 5} data points collected`);
      setEntityName('');
    }, 3500);
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
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
                  onKeyPress={(e) => e.key === 'Enter' && handleEntityScan()}
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

              {isScanning && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-corporate-lightGray">Scanning progress</span>
                    <span className="text-white">{scanProgress}%</span>
                  </div>
                  <Progress value={scanProgress} className="h-2" />
                </div>
              )}

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
                    <div className="mt-2 text-lg font-bold text-blue-400">247</div>
                    <div className="text-xs text-corporate-lightGray">Entities tracked</div>
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
                    <div className="mt-2 text-lg font-bold text-green-400">1,832</div>
                    <div className="text-xs text-corporate-lightGray">Director profiles</div>
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
                    <div className="mt-2 text-lg font-bold text-purple-400">156</div>
                    <div className="text-xs text-corporate-lightGray">Early mentions</div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-corporate-darkSecondary border-corporate-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-white">Recently Discovered Entities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {discoveredEntities.map((entity) => (
                    <div key={entity.id} className="flex items-center justify-between p-3 border border-corporate-border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{entity.name}</span>
                          <Badge className={getRiskBadgeColor(entity.riskLevel)}>
                            {entity.riskLevel.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="text-xs text-corporate-lightGray mt-1">
                          {entity.type} • {entity.lastSeen} • {entity.confidence}% confidence
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="border-corporate-border">
                        <Target className="h-3 w-3 mr-1" />
                        Analyze
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
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
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-corporate-lightGray">FastTech Solutions</span>
                    <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">Medium</Badge>
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
                  <div className="text-xs text-corporate-lightGray space-y-1">
                    <div className="flex items-center justify-between">
                      <span>↑ Litigation risk</span>
                      <span className="text-red-400">+15%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>↓ Regulatory compliance</span>
                      <span className="text-green-400">+8%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>→ Media sentiment</span>
                      <span className="text-blue-400">Stable</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>↑ Financial distress</span>
                      <span className="text-yellow-400">+23%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-corporate-darkSecondary border-corporate-border">
              <CardHeader>
                <CardTitle className="text-sm text-white">Risk Assessment Matrix</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="text-center font-medium text-corporate-lightGray">Risk Type</div>
                  <div className="text-center font-medium text-corporate-lightGray">Current Level</div>
                  <div className="text-center font-medium text-corporate-lightGray">Trend</div>
                  <div className="text-center font-medium text-corporate-lightGray">Prediction</div>
                  
                  <div className="text-corporate-lightGray">Reputation</div>
                  <div className="text-center"><Badge className="bg-yellow-500/20 text-yellow-400">Medium</Badge></div>
                  <div className="text-center text-red-400">↑ +12%</div>
                  <div className="text-center text-red-400">Rising</div>
                  
                  <div className="text-corporate-lightGray">Legal</div>
                  <div className="text-center"><Badge className="bg-red-500/20 text-red-400">High</Badge></div>
                  <div className="text-center text-red-400">↑ +8%</div>
                  <div className="text-center text-red-400">Critical</div>
                  
                  <div className="text-corporate-lightGray">Financial</div>
                  <div className="text-center"><Badge className="bg-green-500/20 text-green-400">Low</Badge></div>
                  <div className="text-center text-green-400">↓ -5%</div>
                  <div className="text-center text-green-400">Stable</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leads" className="space-y-4 mt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Automated Lead Generation
                </h3>
                <p className="text-corporate-lightGray text-sm">
                  AI-identified prospects based on emerging reputation threats
                </p>
              </div>
              <Button className="bg-corporate-accent text-black hover:bg-corporate-accentDark">
                <Zap className="h-4 w-4 mr-2" />
                Generate New Leads
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {leadProspects.map((lead) => (
                <Card key={lead.id} className="bg-corporate-darkSecondary border-corporate-border">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm text-white">{lead.entityName}</CardTitle>
                      <Badge className={getPriorityBadgeColor(lead.priority)}>
                        {lead.priority.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-corporate-lightGray">Risk Score</span>
                        <div className="text-lg font-bold text-red-400">{lead.riskScore}</div>
                      </div>
                      <div>
                        <span className="text-corporate-lightGray">Est. Value</span>
                        <div className="text-lg font-bold text-corporate-accent">{lead.estimatedValue}</div>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-corporate-lightGray">Threat Type</span>
                      <div className="text-sm text-white">{lead.threatType}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-corporate-accent text-black hover:bg-corporate-accentDark">
                        Initiate Contact
                      </Button>
                      <Button size="sm" variant="outline" className="border-corporate-border">
                        View Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-corporate-darkSecondary border-corporate-border">
              <CardHeader>
                <CardTitle className="text-sm text-white">Lead Generation Pipeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-blue-400">34</div>
                    <div className="text-xs text-corporate-lightGray">Identified</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-yellow-400">12</div>
                    <div className="text-xs text-corporate-lightGray">Qualified</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-orange-400">8</div>
                    <div className="text-xs text-corporate-lightGray">Contacted</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-green-400">3</div>
                    <div className="text-xs text-corporate-lightGray">Converted</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-green-500/10 border-green-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-green-400">System Status</div>
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

              <Card className="bg-corporate-darkSecondary border-corporate-border">
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-white mb-1">Alerts Today</div>
                  <div className="text-lg font-bold text-red-400">18</div>
                  <div className="text-xs text-corporate-lightGray">Threat notifications</div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-corporate-darkSecondary border-corporate-border">
              <CardHeader>
                <CardTitle className="text-sm text-white flex items-center gap-2">
                  <Clock className="h-4 w-4 text-corporate-accent" />
                  Real-Time Activity Feed
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                {[
                  { time: '14:32', event: 'New domain registration detected: suspicious-crypto.com', severity: 'high' },
                  { time: '14:28', event: 'Director appointment: John Smith at TechCorp Ltd', severity: 'medium' },
                  { time: '14:25', event: 'Negative media mention detected for ClientCorp', severity: 'high' },
                  { time: '14:22', event: 'Regulatory filing submitted by FinanceGroup', severity: 'low' },
                  { time: '14:18', event: 'New business registration: Innovation Ventures Ltd', severity: 'medium' },
                  { time: '14:15', event: 'Social media threat level increased for Target Entity', severity: 'critical' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border border-corporate-border rounded-lg">
                    <div className="text-xs text-corporate-lightGray min-w-[3rem]">{activity.time}</div>
                    <div className="flex-1">
                      <div className="text-sm text-white">{activity.event}</div>
                    </div>
                    <Badge className={getRiskBadgeColor(activity.severity)}>
                      {activity.severity}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default GenesisSentinelPanel;
