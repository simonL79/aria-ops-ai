import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Rocket, Target, Globe, TrendingUp, Shield, Zap, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import PersonaSaturationReports from './PersonaSaturationReports';

interface SaturationCampaign {
  id: string;
  entityName: string;
  status: 'planning' | 'generating' | 'deploying' | 'indexing' | 'monitoring' | 'completed';
  progress: number;
  contentGenerated: number;
  deploymentsSuccessful: number;
  serpPenetration: number;
  estimatedImpact: string;
}

const PersonaSaturationPanel = () => {
  const [activeTab, setActiveTab] = useState('deploy');
  const [entityName, setEntityName] = useState('');
  const [targetKeywords, setTargetKeywords] = useState('');
  const [contentCount, setContentCount] = useState(50);
  const [saturationMode, setSaturationMode] = useState<'defensive' | 'aggressive' | 'nuclear'>('defensive');
  const [deploymentTargets, setDeploymentTargets] = useState(['github-pages']);
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState<SaturationCampaign | null>(null);
  const [campaigns] = useState<SaturationCampaign[]>([]);

  const executePersonaSaturation = async () => {
    if (!entityName.trim() || !targetKeywords.trim()) {
      toast.error('Please enter entity name and target keywords');
      return;
    }

    setIsExecuting(true);
    
    const campaign: SaturationCampaign = {
      id: `campaign-${Date.now()}`,
      entityName,
      status: 'planning',
      progress: 0,
      contentGenerated: 0,
      deploymentsSuccessful: 0,
      serpPenetration: 0,
      estimatedImpact: 'Calculating...'
    };
    setCurrentCampaign(campaign);

    // Progress simulation
    const progressInterval = setInterval(() => {
      setCurrentCampaign(prev => {
        if (!prev) return null;
        const newProgress = Math.min(prev.progress + 20, 80); // Stop at 80% until real completion
        let newStatus = prev.status;
        
        if (newProgress === 20) newStatus = 'generating';
        if (newProgress === 40) newStatus = 'deploying';
        if (newProgress === 60) newStatus = 'indexing';
        if (newProgress === 80) newStatus = 'monitoring';
        
        return { ...prev, progress: newProgress, status: newStatus };
      });
    }, 2000);

    try {
      const keywords = targetKeywords.split(',').map(k => k.trim()).filter(k => k.length > 0);
      
      console.log('Sending request to persona-saturation function...');
      
      const { data, error } = await supabase.functions.invoke('persona-saturation', {
        body: {
          entityName,
          targetKeywords: keywords,
          contentCount,
          deploymentTargets,
          saturationMode
        }
      });

      clearInterval(progressInterval);

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to invoke persona saturation function');
      }

      if (!data || !data.success) {
        throw new Error(data?.error || 'Unknown error from persona saturation function');
      }

      // Update campaign with real results
      setCurrentCampaign(prev => prev ? {
        ...prev,
        status: 'completed',
        progress: 100,
        contentGenerated: data.campaign.contentGenerated,
        deploymentsSuccessful: data.campaign.deployments.successful,
        serpPenetration: (data.campaign.serpAnalysis.penetrationRate || 0) * 100,
        estimatedImpact: data.estimatedSERPImpact
      } : null);

      toast.success(`Persona Saturation deployed: ${data.campaign.contentGenerated} pieces across ${data.campaign.deployments.successful} platforms`);
      
    } catch (error: any) {
      clearInterval(progressInterval);
      console.error('Persona Saturation error:', error);
      
      setCurrentCampaign(prev => prev ? { 
        ...prev, 
        status: 'completed', 
        progress: 0,
        estimatedImpact: 'Failed - See error details'
      } : null);
      
      // More detailed error message
      const errorMessage = error.message || 'Unknown error occurred';
      toast.error(`Persona Saturation failed: ${errorMessage}`);
      
      // If it's a connection error, provide additional guidance
      if (errorMessage.includes('Failed to send a request') || errorMessage.includes('fetch')) {
        toast.error('Edge function connection issue. Please check function deployment and try again.');
      }
    } finally {
      setIsExecuting(false);
    }
  };

  const getSaturationModeColor = (mode: string) => {
    switch (mode) {
      case 'defensive': return 'bg-blue-100 text-blue-800';
      case 'aggressive': return 'bg-orange-100 text-orange-800';
      case 'nuclear': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'monitoring': return 'bg-blue-100 text-blue-800';
      case 'deploying': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Rocket className="h-5 w-5" />
          A.R.I.A™ Persona Saturation Deployment
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Deploy 50-1000+ positive articles across free hosting platforms to dominate search results
        </p>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="deploy">Deploy Campaign</TabsTrigger>
            <TabsTrigger value="monitor">Monitor Progress</TabsTrigger>
            <TabsTrigger value="campaigns">Campaign History</TabsTrigger>
          </TabsList>

          <TabsContent value="deploy" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Entity</label>
                <Input
                  placeholder="Enter entity name (e.g., Company Name, Person)"
                  value={entityName}
                  onChange={(e) => setEntityName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Keywords</label>
                <Input
                  placeholder="Enter keywords (comma-separated)"
                  value={targetKeywords}
                  onChange={(e) => setTargetKeywords(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Content Count</label>
                <Select value={contentCount.toString()} onValueChange={(v) => setContentCount(parseInt(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 Articles (Test)</SelectItem>
                    <SelectItem value="25">25 Articles (Light)</SelectItem>
                    <SelectItem value="50">50 Articles (Standard)</SelectItem>
                    <SelectItem value="100">100 Articles (Heavy)</SelectItem>
                    <SelectItem value="250">250 Articles (Saturation)</SelectItem>
                    <SelectItem value="500">500 Articles (Dominance)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Saturation Mode</label>
                <Select value={saturationMode} onValueChange={(v) => setSaturationMode(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="defensive">Defensive (Balanced)</SelectItem>
                    <SelectItem value="aggressive">Aggressive (Promotional)</SelectItem>
                    <SelectItem value="nuclear">Nuclear (Maximum Impact)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Deployment Platforms</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { id: 'github-pages', name: 'GitHub Pages', icon: Globe },
                  { id: 'telegra-ph', name: 'Telegraph', icon: Zap },
                  { id: 'medium', name: 'Medium', icon: Target },
                  { id: 'netlify', name: 'Netlify', icon: TrendingUp }
                ].map(platform => {
                  const Icon = platform.icon;
                  const isSelected = deploymentTargets.includes(platform.id);
                  return (
                    <Button
                      key={platform.id}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      className="justify-start"
                      onClick={() => {
                        if (isSelected) {
                          setDeploymentTargets(prev => prev.filter(t => t !== platform.id));
                        } else {
                          setDeploymentTargets(prev => [...prev, platform.id]);
                        }
                      }}
                    >
                      <Icon className="h-4 w-4 mr-1" />
                      {platform.name}
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <div>
                  <h4 className="font-medium text-yellow-800">Free Deployment Strategy</h4>
                  <p className="text-sm text-yellow-700">
                    Using only free platforms: GitHub Pages, Netlify, Telegraph. No hosting costs.
                  </p>
                </div>
              </div>
              <Badge className={getSaturationModeColor(saturationMode)}>
                {saturationMode.toUpperCase()}
              </Badge>
            </div>

            <Button 
              onClick={executePersonaSaturation}
              disabled={isExecuting || !entityName.trim() || !targetKeywords.trim()}
              className="w-full"
              size="lg"
            >
              {isExecuting ? (
                <>
                  <Shield className="h-4 w-4 mr-2 animate-spin" />
                  Deploying Persona Saturation...
                </>
              ) : (
                <>
                  <Rocket className="h-4 w-4 mr-2" />
                  Deploy {contentCount} Articles Across {deploymentTargets.length} Platforms
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="monitor">
            {currentCampaign ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Campaign: {currentCampaign.entityName}</h3>
                  <Badge className={getStatusColor(currentCampaign.status)}>
                    {currentCampaign.status.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{currentCampaign.progress}%</span>
                  </div>
                  <Progress value={currentCampaign.progress} />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{currentCampaign.contentGenerated}</div>
                    <div className="text-xs text-muted-foreground">Content Generated</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{currentCampaign.deploymentsSuccessful}</div>
                    <div className="text-xs text-muted-foreground">Deployments</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{currentCampaign.serpPenetration.toFixed(1)}%</div>
                    <div className="text-xs text-muted-foreground">SERP Penetration</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">72h</div>
                    <div className="text-xs text-muted-foreground">Est. Full Impact</div>
                  </div>
                </div>

                {currentCampaign.status === 'completed' && (
                  <div className={`p-4 border rounded-lg ${
                    currentCampaign.progress === 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
                  }`}>
                    <h4 className={`font-medium mb-2 ${
                      currentCampaign.progress === 0 ? 'text-red-800' : 'text-green-800'
                    }`}>
                      {currentCampaign.progress === 0 ? 'Campaign Failed' : 'Campaign Completed Successfully'}
                    </h4>
                    <p className={`text-sm ${
                      currentCampaign.progress === 0 ? 'text-red-700' : 'text-green-700'
                    }`}>
                      {currentCampaign.estimatedImpact}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Rocket className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No active campaign. Deploy a persona saturation campaign to monitor progress.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="campaigns">
            {campaigns.length > 0 ? (
              <div className="space-y-3">
                {campaigns.map(campaign => (
                  <div key={campaign.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium">{campaign.entityName}</div>
                        <div className="text-sm text-gray-500">
                          {campaign.contentGenerated} articles, {campaign.deploymentsSuccessful} deployments
                        </div>
                      </div>
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500">
                      SERP Impact: {campaign.estimatedImpact}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Globe className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No campaigns yet. Deploy your first persona saturation campaign.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PersonaSaturationPanel;
