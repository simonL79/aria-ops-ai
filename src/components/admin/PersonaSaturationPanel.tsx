import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Rocket, Target, Globe, TrendingUp, Shield, Zap, AlertTriangle, Cloud, Code, FileText, Radio } from 'lucide-react';
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
  createdAt?: string;
}

interface DatabaseCampaign {
  id: string;
  entity_name: string;
  campaign_data: any;
  created_at: string;
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
  const [campaigns, setCampaigns] = useState<SaturationCampaign[]>([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);

  // Fetch campaign history from database
  const fetchCampaigns = async () => {
    setLoadingCampaigns(true);
    try {
      const { data, error } = await supabase
        .from('persona_saturation_campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching campaigns:', error);
        return;
      }

      if (data) {
        const formattedCampaigns = data.map((campaign: any) => ({
          id: campaign.id,
          entityName: campaign.entity_name,
          status: 'completed' as const,
          progress: 100,
          contentGenerated: campaign.campaign_data?.contentGenerated || 0,
          deploymentsSuccessful: campaign.campaign_data?.deploymentsSuccessful || 0,
          serpPenetration: (campaign.campaign_data?.serpPenetration || 0) * 100,
          estimatedImpact: `${campaign.campaign_data?.deploymentsSuccessful || 0} articles deployed`,
          createdAt: campaign.created_at
        }));
        setCampaigns(formattedCampaigns);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoadingCampaigns(false);
    }
  };

  // Fetch campaigns when component mounts or when switching to campaigns tab
  useEffect(() => {
    if (activeTab === 'campaigns') {
      fetchCampaigns();
    }
  }, [activeTab]);

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
        const newProgress = Math.min(prev.progress + 15, 75); // Stop at 75% until real completion
        let newStatus = prev.status;
        
        if (newProgress === 15) newStatus = 'generating';
        if (newProgress === 30) newStatus = 'deploying';
        if (newProgress === 45) newStatus = 'indexing';
        if (newProgress === 60) newStatus = 'monitoring';
        if (newProgress === 75) newStatus = 'monitoring';
        
        return { ...prev, progress: newProgress, status: newStatus };
      });
    }, 3000);

    try {
      const keywords = targetKeywords.split(',').map(k => k.trim()).filter(k => k.length > 0);
      
      console.log('🚀 Deploying live articles to GitHub Pages...');
      
      const { data, error } = await supabase.functions.invoke('persona-saturation', {
        body: {
          entityName,
          targetKeywords: keywords,
          contentCount,
          deploymentTargets,
          saturationMode,
          realDeployment: true // Enable real GitHub deployment
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

      toast.success(`🎯 Live Deployment Complete! ${data.campaign.deployments.successful}/${contentCount} articles now live on GitHub Pages`);
      
      // Show deployment URLs
      if (data.campaign.deployments.urls && data.campaign.deployments.urls.length > 0) {
        toast.success(`🌐 ${data.campaign.deployments.urls.length} live websites created. Check Reports tab for all URLs.`);
      }
      
      // Refresh campaigns list if we're on that tab
      if (activeTab === 'campaigns') {
        fetchCampaigns();
      }
      
    } catch (error: any) {
      clearInterval(progressInterval);
      console.error('Persona Saturation error:', error);
      
      setCurrentCampaign(prev => prev ? { 
        ...prev, 
        status: 'completed', 
        progress: 0,
        estimatedImpact: 'Failed - See error details'
      } : null);
      
      const errorMessage = error.message || 'Unknown error occurred';
      toast.error(`❌ Deployment failed: ${errorMessage}`);
      
      if (errorMessage.includes('GitHub token')) {
        toast.error('⚠️ GitHub token missing. Please configure GITHUB_TOKEN in edge function secrets.');
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
          A.R.I.A™ Live Article Deployment
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Deploy SEO-optimized articles to live GitHub Pages sites with automated indexing
        </p>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="deploy">Deploy Campaign</TabsTrigger>
            <TabsTrigger value="monitor">Monitor Progress</TabsTrigger>
            <TabsTrigger value="campaigns">Campaign History</TabsTrigger>
            <TabsTrigger value="reports">Live Reports</TabsTrigger>
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
              <label className="text-sm font-medium">Free Hosting Platforms</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { id: 'github-pages', name: 'GitHub Pages', icon: Globe, category: 'Git-based' },
                  { id: 'netlify', name: 'Netlify', icon: TrendingUp, category: 'JAMstack' },
                  { id: 'vercel', name: 'Vercel', icon: Zap, category: 'Edge' },
                  { id: 'surge', name: 'Surge.sh', icon: Target, category: 'Static' },
                  { id: 'firebase', name: 'Firebase', icon: Shield, category: 'Google' },
                  { id: 'gitlab-pages', name: 'GitLab Pages', icon: Code, category: 'Git-based' },
                  { id: 'render', name: 'Render', icon: Cloud, category: 'Static' },
                  { id: 'telegraph', name: 'Telegraph', icon: FileText, category: 'Instant' },
                  { id: 'pages-dev', name: 'Pages.dev', icon: Globe, category: 'Cloudflare' },
                  { id: 'tiiny-host', name: 'Tiiny Host', icon: Target, category: 'Simple' },
                  { id: 'neocities', name: 'Neocities', icon: Radio, category: 'Creative' },
                  { id: 'google-sites', name: 'Google Sites', icon: Shield, category: 'Google' }
                ].map(platform => {
                  const Icon = platform.icon;
                  const isSelected = deploymentTargets.includes(platform.id);
                  return (
                    <Button
                      key={platform.id}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      className="justify-start h-auto py-2 px-3"
                      onClick={() => {
                        if (isSelected) {
                          setDeploymentTargets(prev => prev.filter(t => t !== platform.id));
                        } else {
                          setDeploymentTargets(prev => [...prev, platform.id]);
                        }
                      }}
                    >
                      <div className="flex flex-col items-start w-full">
                        <div className="flex items-center gap-1 mb-1">
                          <Icon className="h-3 w-3" />
                          <span className="text-xs font-medium">{platform.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{platform.category}</span>
                      </div>
                    </Button>
                  );
                })}
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Selected {deploymentTargets.length} platform{deploymentTargets.length !== 1 ? 's' : ''} • Each creates unique domains for maximum SERP coverage
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-green-600" />
                <div>
                  <h4 className="font-medium text-green-800">Multi-Platform SERP Saturation</h4>
                  <p className="text-sm text-green-700">
                    ✅ Deploy across {deploymentTargets.length} free hosting platform{deploymentTargets.length !== 1 ? 's' : ''}<br/>
                    ✅ Creates diverse domain portfolio for SEO<br/>
                    ✅ Strategic backlinks between all articles<br/>
                    ✅ Central hub repository with sitemap<br/>
                    ✅ Automatic search engine pinging
                  </p>
                </div>
              </div>
              <Badge className={getSaturationModeColor(saturationMode)}>
                {saturationMode.toUpperCase()}
              </Badge>
            </div>

            <Button 
              onClick={executePersonaSaturation}
              disabled={isExecuting || !entityName.trim() || !targetKeywords.trim() || deploymentTargets.length === 0}
              className="w-full"
              size="lg"
            >
              {isExecuting ? (
                <>
                  <Shield className="h-4 w-4 mr-2 animate-spin" />
                  Deploying {contentCount} Articles to {deploymentTargets.length} Platform{deploymentTargets.length !== 1 ? 's' : ''}...
                </>
              ) : (
                <>
                  <Rocket className="h-4 w-4 mr-2" />
                  🚀 Deploy {contentCount} Articles to {deploymentTargets.length} Platform{deploymentTargets.length !== 1 ? 's' : ''}
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
                    <div className="text-xs text-muted-foreground">Live Sites</div>
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
            {loadingCampaigns ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-2 text-gray-500">Loading campaigns...</p>
              </div>
            ) : campaigns.length > 0 ? (
              <div className="space-y-3">
                {campaigns.map(campaign => (
                  <div key={campaign.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium">{campaign.entityName}</div>
                        <div className="text-sm text-gray-500">
                          {campaign.contentGenerated} articles, {campaign.deploymentsSuccessful} live deployments
                        </div>
                        {campaign.createdAt && (
                          <div className="text-xs text-gray-400">
                            {new Date(campaign.createdAt).toLocaleDateString()}
                          </div>
                        )}
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

          <TabsContent value="reports">
            <PersonaSaturationReports />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PersonaSaturationPanel;
